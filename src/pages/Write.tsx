import { useState } from 'react';
import BlogEditor from '../components/BlogEditor';
import Navbar from '../components/Navbar';
import parse from 'html-react-parser'

const Write = () => {
  const [htmlContent, setHtmlContent] = useState('')

  const handleEditorContentSave = (html: any) => {
    //console.log(html);
    setHtmlContent(html)
  }

  return (
    <>
    <Navbar />
      <BlogEditor onEditorContentSave={handleEditorContentSave}/>
      <hr></hr>
      <div>{parse(htmlContent)}</div>
    </>
  );
};

export default Write;
