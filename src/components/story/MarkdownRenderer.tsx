import MarkdownIt from 'markdown-it';

const MarkdownRenderer = ({ content }: { content: string }) => {
  const mdParser = new MarkdownIt();
  const parsedContent = mdParser.render(content);

  return <div dangerouslySetInnerHTML={{ __html: parsedContent }} />;
};

export default MarkdownRenderer;
