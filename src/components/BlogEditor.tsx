import MarkdownIt from 'markdown-it';
import { useState } from 'react';
import ReactMarkdownEditorLite from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css'; // Import the styles


const BlogEditor = ({ onContentChange, initialContent = '' }) => {
  const [content, setContent] = useState(initialContent);
  const mdParser = new MarkdownIt();

  const handleEditorChange = ({ text }) => {
    setContent(text);
    onContentChange(text);
  };

  return (
    // <div className='w-full max-w-4xl'>
      <ReactMarkdownEditorLite
        value={content}
        style={{ height: '400px' }}
        renderHTML={text => mdParser.render(text)}
        onChange={handleEditorChange}
      />
    // </div>
  );
};

export default BlogEditor;
