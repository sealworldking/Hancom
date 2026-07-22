const out=document.querySelector("#out");

const show=(value) => {
  const shown=(typeof value==="object"&&value!==null)?JSON.stringify(value):value;
  out.textContent=`${shown} (타입: ${typeof value})`;
};

let empty;

document.querySelector("#bStr").addEventListener("click",()=>show("안녕"));
document.querySelector("#bNum").addEventListener("click", () => show(10));              // Number
document.querySelector("#bBool").addEventListener("click", () => show(true));            // Boolean
document.querySelector("#bUndef").addEventListener("click", () => show(empty));           // undefined (값 미할당)
document.querySelector("#bNull").addEventListener("click", () => show(null));             // null → typeof는 "object" (유명한 버그)
document.querySelector("#bArr").addEventListener("click", () => show([1, "Bob", 10]));   // Array → object
document.querySelector("#bObj").addEventListener("click", () => show({ name: "Bob" }));  // Object