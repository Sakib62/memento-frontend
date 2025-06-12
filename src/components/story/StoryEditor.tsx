import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ChangeCodeMirrorLanguage,
  CodeToggle,
  ConditionalContents,
  CreateLink,
  DiffSourceToggleWrapper,
  InsertCodeBlock,
  InsertImage,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  MDXEditorMethods,
  StrikeThroughSupSubToggles,
  UndoRedo,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

export interface StoryEditorHandle {
  getMarkdown: () => string | undefined;
  setMarkdown: (markdown: string) => void;
}

const StoryEditor = forwardRef<StoryEditorHandle, { isViewMode?: boolean }>(
  ({ isViewMode = false }, ref) => {
    const mdxEditorRef = useRef<MDXEditorMethods>(null);
    const [diffMarkdown, setDiffMarkdown] = useState('');

    useImperativeHandle(
      ref,
      () => ({
        getMarkdown: () => {
          const markdown = mdxEditorRef.current?.getMarkdown();
          const formattedMarkdown = markdown?.replace(/\n{2,}/g, match => {
            return '\n\n' + '<br />\n'.repeat((match.length - 1) / 2);
          });
          return formattedMarkdown;
        },

        setMarkdown: (initialMarkdown: string) => {
          const formattedMarkdown = initialMarkdown.replace(
            /<br\s*\/?>/g,
            '&nbsp;\n'
          );
          setDiffMarkdown(formattedMarkdown);
          mdxEditorRef.current?.setMarkdown(formattedMarkdown);
        },
      }),
      []
    );

    async function imageUploadHandler(image: File): Promise<string> {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('upload_preset', '<your_unsigned_upload_preset>');

      // const response = await fetch(
      //   'https://api.cloudinary.com/v1_1/<your_cloud_name>/image/upload',
      //   {
      //     method: 'POST',
      //     body: formData,
      //   }
      // );

      // const data = await response.json();
      // return data.secure_url; // Cloudinary-hosted image URL

      return 'https://picsum.photos/200'
    }

    return (
      <div className='mt-4'>
        <MDXEditor
          contentEditableClassName='bg-white prose'
          ref={mdxEditorRef}
          readOnly={isViewMode}
          markdown=''
          plugins={[
            headingsPlugin({ allowedHeadingLevels: [1, 2, 3, 4] }),
            listsPlugin(),
            codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
            codeMirrorPlugin({
              codeBlockLanguages: {
                js: 'JavaScript',
                css: 'CSS',
                html: 'HTML',
                tsx: 'TypeScript (react)',
                java: 'Java',
                cpp: 'C++',
                python: 'Python',
              },
            }),
            quotePlugin(),
            thematicBreakPlugin(),
            imagePlugin({imageUploadHandler}),
            linkPlugin(),
            linkDialogPlugin(),
            markdownShortcutPlugin(),
            diffSourcePlugin({
              diffMarkdown: diffMarkdown,
              readOnlyDiff: true,
            }),
            ...(!isViewMode
              ? [
                  toolbarPlugin({
                    toolbarClassName: 'bg-red-500 sticky top-16 ',
                    toolbarContents: () => (
                      <>
                        <DiffSourceToggleWrapper>
                          <UndoRedo />
                          <BoldItalicUnderlineToggles />
                          <ListsToggle />
                          <CodeToggle />
                          <ConditionalContents
                            options={[
                              {
                                when: editor =>
                                  editor?.editorType === 'codeblock',
                                contents: () => <ChangeCodeMirrorLanguage />,
                              },
                              {
                                fallback: () => <InsertCodeBlock />,
                              },
                            ]}
                          />
                          <BlockTypeSelect />
                          <InsertImage />
                          <CreateLink />
                          <InsertThematicBreak />
                          <StrikeThroughSupSubToggles />
                        </DiffSourceToggleWrapper>
                      </>
                    ),
                  }),
                ]
              : []),
          ]}
        />
      </div>
    );
  }
);

export default StoryEditor;
