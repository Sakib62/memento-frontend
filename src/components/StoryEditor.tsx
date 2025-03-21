import MarkdownIt from 'markdown-it';
import { useState } from 'react';
import ReactMarkdownEditorLite from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css'; // Import the styles

interface StoryEditorProps {
  onContentChange: (text: string) => void;
  initialContent?: string;
}

const StoryEditor = ({
  onContentChange,
  initialContent = '',
}: StoryEditorProps) => {
  const [content, setContent] = useState(initialContent);
  const mdParser = new MarkdownIt();

  const handleEditorChange = ({ text }: { text: string }) => {
    setContent(text);
    onContentChange(text);
  };

  return (
    <ReactMarkdownEditorLite
      value={content}
      style={{ height: '400px' }}
      renderHTML={text => mdParser.render(text)}
      onChange={handleEditorChange}
    />
  );
};

export default StoryEditor;
