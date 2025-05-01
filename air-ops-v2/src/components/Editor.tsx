import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Don't forget to import the CSS

const Editor = ({ value, onChange }) => {
  const [text, setText] = useState("");

  const modules = {
    toolbar: [
      [{ "header": [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { "list": "ordered" },
        { "list": "bullet" },
        { "indent": "-1" },
        { "indent": "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  return (
    <div className="text-editor">
      <ReactQuill
        theme="snow"
        // value={text}
        // onChange={setText}
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

export default Editor;
