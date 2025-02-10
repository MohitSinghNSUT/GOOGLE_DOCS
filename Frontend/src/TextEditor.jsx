import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
//  this is used to add fuunctionality in toolbars
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block"],
  ["link", "image", "video", "formula"],

  [{ header: 1 }, { header: 2 }],
  [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
  [{ script: "sub" }, { script: "super" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ direction: "rtl" }],

  [{ size: ["small", false, "large", "huge"] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],
  ["clean"],
];
export const TextEditor = () => {
  // `this is used to initialize an editor only once and erase the prvious on render of start `
 // socket contains current user socket   
  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState(null);
  //    use params hooks is used to find parameters of url
  const { id } = useParams();
    // load the previous document and set the contents of it
  useEffect(() => {
    if (!socket || !quill || !id) return;
    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable(true)
    });
    // get the contents of id provided 
    socket.emit("get-document", id);
  }, [socket, quill, id]);

  useEffect(() => {
    if (!socket || !quill) {
      return;
    }
//    save the documents after the interval and clean the interval
    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

//   use callback hook is used to render the data only when the complete data changes in it 
//  useeffect hook -> change the function reference when the complete data changes 
  const ref = useCallback((ref) => {
    if (!ref) return;
    ref.innerHTML = "";
    const editor = document.createElement("div"); //create contanier
    ref.append(editor);
    const q = new Quill(editor, {
      modules: {
        toolbar: toolbarOptions,
      },
      theme: "snow",
    });
    setQuill(q);
  }, []);
  useEffect(() => {
    if (!quill || !socket) return;
    const handler = (delta, oldDelta, source) => {
        // if i have changed the data if i am the source then only send the update changes to backend
      if (source != "user") {
        return;
      }
      socket.emit("send-change", delta);
    };
    quill.on("text-change", handler);
    return () => {
      quill.off();
    };
  }, [socket, quill]);
  useEffect(() => {
    if (!quill || !socket) return;
    const handler = (delta, oldDelta, source) => {
        // update the contents in docs
      quill.updateContents(delta);
    };
    socket.on("receive-changes", handler);
    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    const s = io("http://localhost:3000");
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  return (
    <>
      <div id="container" ref={ref}></div>
    </>
  );
};
