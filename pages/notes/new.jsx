// pages/notes/new.jsx
import { useRouter } from "next/router";
import { useState } from "react";
import Editor from "../../components/editor";
import TemplateSelector from "../../components/TemplateSelector";
import { saveNote } from "../../lib/storage";
import { getTemplate } from "../../lib/templates";

export default function NewNote() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState("blank");
  const [templateData, setTemplateData] = useState(getTemplate("blank"));

  const handleTemplateSelect = (templateKey) => {
    setSelectedTemplate(templateKey);
    setTemplateData(getTemplate(templateKey));
  };

  async function handleSave(payload) {
    const saved = await saveNote({
      title: payload.title,
      content: payload.content,
      tags: payload.tags,
      visibility: payload.visibility,
    });
    router.push(`/notes/${saved.slug}`);
    return saved;
  }

  return (
    <div>
      <h1>Create a new note</h1>
      <TemplateSelector 
        onSelect={handleTemplateSelect} 
        selectedTemplate={selectedTemplate} 
      />
      <Editor 
        onSave={handleSave} 
        saveLabel="Create Note"
        initialTitle={templateData.title}
        initialContent={templateData.content}
        initialTags={templateData.tags}
        initialVisibility={templateData.visibility}
      />
    </div>
  );
}
