import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";

type RichTextEditorProps = {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
};

const modules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ],
};

const formats = ["bold", "italic", "underline", "header", "list"];

const RichTextEditor = ({
  value = "",
  onChange,
  disabled = false,
}: RichTextEditorProps) => {
  return (
    <div className="">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        readOnly={disabled}
        modules={modules}
        formats={formats}
        className="min-h-[320px] bg-background"
      />
    </div>
  );
};

export default RichTextEditor;
