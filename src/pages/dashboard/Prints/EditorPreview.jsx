import { Editor } from '@tinymce/tinymce-react';
import { LANDSCAPE_EDITOR_INIT } from './editorInit';

/* eslint-disable react/prop-types */
const EditorPreview = ({ value }) => {
  return <Editor value={value} apiKey="ltsdik9bjzzfm8i8g4ve5b32ii5sz0t7j6g2ag5khxm0bn1y" init={LANDSCAPE_EDITOR_INIT} />;
};

export default EditorPreview;
