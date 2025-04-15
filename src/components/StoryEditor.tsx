import MarkdownIt from 'markdown-it';
import { useState } from 'react';
import ReactMarkdownEditorLite from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

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

  const onImageUpload = (file: File, callback: (url: string) => void) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result) {
        const convertBase64UrlToBlob = (urlData: string): Blob => {
          const [meta, base64Data] = urlData.split(',');
          const mimeMatch = meta.match(/:(.*?);/);
          const mimeType = mimeMatch
            ? mimeMatch[1]
            : 'application/octet-stream';
          const byteString = atob(base64Data);
          const u8arr = new Uint8Array(byteString.length);

          for (let i = 0; i < byteString.length; i++) {
            u8arr[i] = byteString.charCodeAt(i);
          }

          return new Blob([u8arr], { type: mimeType });
        };

        const blob = convertBase64UrlToBlob(reader.result as string);

        // Simulate an async upload (replace with actual upload logic)
        setTimeout(() => {
          // Provide the uploaded image URL to the callback
          callback(
            'https://avatars0.githubusercontent.com/u/21263805?s=40&v=4'
          );
        }, 1000);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <ReactMarkdownEditorLite
      value={content}
      style={{ height: '400px' }}
      renderHTML={text => mdParser.render(text)}
      onChange={handleEditorChange}
      canView={{
        menu: true,
        md: true,
        html: false,
        both: true,
        fullScreen: false,
        hideMenu: true,
      }}
      view={{ menu: true, md: true, html: false }}
      onImageUpload={onImageUpload}
    />
  );
};

export default StoryEditor;
