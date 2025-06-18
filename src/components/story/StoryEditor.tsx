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
import { forwardRef, memo, useImperativeHandle, useRef, useState } from 'react';

export interface StoryEditorHandle {
  getMarkdown: () => string | undefined;
  setMarkdown: (markdown: string) => void;
}

const StoryEditor = memo(
  forwardRef<StoryEditorHandle, { isViewMode?: boolean }>(
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

      return (
        <MDXEditor
          contentEditableClassName={`h-full prose ${!isViewMode ? 'focus:ring-2 focus:ring-blue-400 border-2 rounded-md shadow-sm bg-neutral-100/30 border-x-slate-300/80 border-b-slate-300/80' : ''}`}
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
            imagePlugin(),
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
                    toolbarClassName: 'bg-gray-300 sticky top-16',
                    toolbarContents: () => (
                      <>
                        <DiffSourceToggleWrapper>
                          <UndoRedo />
                          <BoldItalicUnderlineToggles />
                          <ListsToggle options={['bullet', 'number']} />
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
      );
    }
  )
);

export default StoryEditor;
