#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Parse command line arguments
const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
  console.error('Usage: node ua-tour-analyze.mjs <input.json> <output.json>');
  process.exit(1);
}

try {
  const inputData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const { nodes, edges, layers } = inputData;

  // Build adjacency maps
  const fanInMap = {}; // How many nodes point TO this node
  const fanOutMap = {}; // How many nodes this node points TO
  const edgesBySource = {}; // edges FROM a node
  const edgesByTarget = {}; // edges TO a node
  const nodeMap = {}; // Quick lookup by ID

  // Initialize maps
  nodes.forEach(node => {
    nodeMap[node.id] = node;
    fanInMap[node.id] = 0;
    fanOutMap[node.id] = 0;
    edgesBySource[node.id] = [];
    edgesByTarget[node.id] = [];
  });

  // Count edges
  edges.forEach(edge => {
    fanOutMap[edge.source] = (fanOutMap[edge.source] || 0) + 1;
    fanInMap[edge.target] = (fanInMap[edge.target] || 0) + 1;
    edgesBySource[edge.source] = edgesBySource[edge.source] || [];
    edgesByTarget[edge.target] = edgesByTarget[edge.target] || [];
    edgesBySource[edge.source].push(edge);
    edgesByTarget[edge.target].push(edge);
  });

  // A. Fan-In Ranking
  const fanInRanking = nodes
    .map(node => ({ id: node.id, fanIn: fanInMap[node.id] || 0, name: node.name }))
    .sort((a, b) => b.fanIn - a.fanIn)
    .slice(0, 20);

  // B. Fan-Out Ranking
  const fanOutRanking = nodes
    .map(node => ({ id: node.id, fanOut: fanOutMap[node.id] || 0, name: node.name }))
    .sort((a, b) => b.fanOut - a.fanOut)
    .slice(0, 20);

  // C. Entry Point Candidates
  const entryPointScores = {};

  nodes.forEach(node => {
    let score = 0;

    // Documentation files
    if (node.type === 'document') {
      if (node.name === 'README.md' && node.filePath === 'README.md') {
        score += 5;
      } else if (node.filePath.endsWith('.md') && !node.filePath.includes('/')) {
        score += 2;
      }
    }

    // Code files
    if (node.type === 'file' && node.name.match(/\.(ts|js|tsx|jsx|rs|go|py|java|cs|rb|php|swift|kt|cpp|c)$/)) {
      const entryNames = ['index.ts', 'index.js', 'main.ts', 'main.js', 'app.ts', 'app.js',
                          'server.ts', 'server.js', 'mod.rs', 'main.go', 'main.py', 'main.rs',
                          'manage.py', 'app.py', 'wsgi.py', 'asgi.py', 'run.py', '__main__.py',
                          'Application.java', 'Main.java', 'Program.cs', 'config.ru', 'index.php',
                          'App.swift', 'Application.kt', 'main.cpp', 'main.c'];

      if (entryNames.includes(node.name)) {
        score += 3;
      }

      // File depth (root or one level deep)
      const depth = node.filePath.split('/').length - 1;
      if (depth <= 1) {
        score += 1;
      }

      // Fan-out in top 10%
      const fanOutValues = Object.values(fanOutMap).sort((a, b) => b - a);
      const top10Threshold = fanOutValues[Math.floor(fanOutValues.length * 0.1)];
      if (fanOutMap[node.id] >= top10Threshold) {
        score += 1;
      }

      // Fan-in in bottom 25%
      const fanInValues = Object.values(fanInMap).sort((a, b) => b - a);
      const bottom25Threshold = fanInValues[Math.floor(fanInValues.length * 0.75)];
      if (fanInMap[node.id] <= bottom25Threshold) {
        score += 1;
      }
    }

    if (score > 0) {
      entryPointScores[node.id] = { score, node };
    }
  });

  const entryPointCandidates = Object.values(entryPointScores)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(item => ({
      id: item.node.id,
      score: item.score,
      name: item.node.name,
      summary: item.node.summary
    }));

  // D. BFS Traversal from top code entry point
  let startNode = null;
  for (const candidate of entryPointCandidates) {
    if (nodeMap[candidate.id].type === 'file') {
      startNode = candidate.id;
      break;
    }
  }

  const bfsTraversal = { startNode: null, order: [], depthMap: {}, byDepth: {} };

  if (startNode) {
    bfsTraversal.startNode = startNode;
    const visited = new Set();
    const queue = [{ id: startNode, depth: 0 }];
    visited.add(startNode);

    while (queue.length > 0) {
      const { id, depth } = queue.shift();
      bfsTraversal.order.push(id);
      bfsTraversal.depthMap[id] = depth;

      if (!bfsTraversal.byDepth[depth]) {
        bfsTraversal.byDepth[depth] = [];
      }
      bfsTraversal.byDepth[depth].push(id);

      // Follow imports and calls edges
      const outgoing = edgesBySource[id] || [];
      const relatedEdges = outgoing.filter(e => e.type === 'imports' || e.type === 'calls');

      relatedEdges.forEach(edge => {
        if (!visited.has(edge.target)) {
          visited.add(edge.target);
          queue.push({ id: edge.target, depth: depth + 1 });
        }
      });
    }
  }

  // E. Non-Code File Inventory
  const nonCodeFiles = {
    documentation: [],
    infrastructure: [],
    data: [],
    config: []
  };

  nodes.forEach(node => {
    if (node.type === 'document') {
      nonCodeFiles.documentation.push({
        id: node.id,
        name: node.name,
        summary: node.summary
      });
    } else if (['service', 'pipeline', 'resource'].includes(node.type)) {
      nonCodeFiles.infrastructure.push({
        id: node.id,
        name: node.name,
        summary: node.summary
      });
    } else if (['table', 'schema', 'endpoint'].includes(node.type)) {
      nonCodeFiles.data.push({
        id: node.id,
        name: node.name,
        summary: node.summary
      });
    } else if (node.type === 'config') {
      nonCodeFiles.config.push({
        id: node.id,
        name: node.name,
        summary: node.summary
      });
    }
  });

  // F. Tightly Coupled Clusters
  const clusters = [];
  const clusterMap = {};

  edges.forEach(edge => {
    // Check for bidirectional relationships
    const reverseEdge = edges.find(e => e.source === edge.target && e.target === edge.source);
    if (reverseEdge) {
      const key = [edge.source, edge.target].sort().join('|');
      if (!clusterMap[key]) {
        clusterMap[key] = new Set([edge.source, edge.target]);
      }
    }
  });

  Object.values(clusterMap).slice(0, 10).forEach(nodeSet => {
    clusters.push({
      nodes: Array.from(nodeSet),
      edgeCount: 2
    });
  });

  // G. Layer List
  const layerList = {
    count: layers.length,
    list: layers
  };

  // H. Node Summary Index
  const nodeSummaryIndex = {};
  nodes.forEach(node => {
    nodeSummaryIndex[node.id] = {
      name: node.name,
      type: node.type,
      summary: node.summary
    };
  });

  // Output results
  const results = {
    scriptCompleted: true,
    entryPointCandidates,
    fanInRanking,
    fanOutRanking,
    bfsTraversal,
    nonCodeFiles,
    clusters,
    layers: layerList,
    nodeSummaryIndex,
    totalNodes: nodes.length,
    totalEdges: edges.length
  };

  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`Tour analysis complete. Results written to ${outputPath}`);
  process.exit(0);

} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
