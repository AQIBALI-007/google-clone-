import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import API from "./api";

function App() {
  const [documents, setDocuments] = useState([]);
  const [docId, setDocId] = useState(null);
  const [title, setTitle] = useState("");

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      if (!docId) return;

      API.put(`/documents/${docId}`, {
        content: editor.getHTML(),
      });
    },
  });

  // Load documents on startup
  useEffect(() => {
    API.get("/documents").then((res) => {
      if (res.data.length > 0) {
        setDocuments(res.data);
        openDocument(res.data[0]);
      } else {
        createNewDocument();
      }
    });
  }, []);

  const createNewDocument = () => {
    API.post("/documents", {
      title: "Untitled Document",
      content: "",
    }).then((res) => {
      setDocuments((prev) => [...prev, res.data]);
      openDocument(res.data);
    });
  };

  const openDocument = (doc) => {
    setDocId(doc.id);
    setTitle(doc.title);
    if (editor) {
      editor.commands.setContent(doc.content || "");
    }
  };

  return (
    <div className="app">
      <header className="navbar">
        <input
          value={title}
          onChange={(e) => {
  const newTitle = e.target.value;
  setTitle(newTitle);

  if (docId) {
    API.put(`/documents/${docId}`, {
      title: newTitle,
    });
  }
}}
          className="title-input"
        />
      </header>

      <div className="container">
        <aside className="sidebar">
          <button onClick={createNewDocument}>+ New Document</button>

          {documents.map((doc) => (
            <div
              key={doc.id}
              className="doc-item"
              onClick={() => openDocument(doc)}
            >
              {doc.title}
            </div>
          ))}
        </aside>

        <main className="editor">
          <EditorContent editor={editor} />
        </main>
      </div>
    </div>
  );
}

export default App;