import { useState, useEffect } from "react";
import type { Snippet } from "../types";

export function useSnippetForm(snippet?: Snippet, isOpen?: boolean) {
  const [formData, setFormData] = useState({
    title: "",
    language: "JavaScript",
    code: "",
    tagsString: "",
    isFavorite: false,
    interviewAnswer: "",
    syntax: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    code: "",
    interviewAnswer: "",
    syntax: "",
  });

  // When modal opens, load snippet data or reset form
  useEffect(() => {
    if (!isOpen) return;

    if (snippet) {
      setFormData({
        title: snippet.title,
        language: snippet.language,
        code: snippet.code,
        tagsString: snippet.tags.join(", "),
        isFavorite: snippet.isFavorite,
        interviewAnswer: snippet.interviewAnswer || "",
        syntax:
          typeof snippet.syntax === "string"
            ? snippet.syntax
            : snippet.syntax?.name || "",
      });
    } else {
      setFormData({
        title: "",
        language: "JavaScript",
        code: "",
        tagsString: "",
        isFavorite: false,
        interviewAnswer: "",
        syntax: "",
      });
    }

    // Clear errors when opening
    setErrors({
      title: "",
      code: "",
      interviewAnswer: "",
      syntax: "",
    });

  }, [snippet, isOpen]);

  // Validation
  const validate = () => {
    const newErrors = {
      title: "",
      code: "",
      interviewAnswer: "",
      syntax: "",
    };

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Code is required";
    }

    if (!formData.interviewAnswer.trim()) {
      newErrors.interviewAnswer = "Explanation is required";
    }

    if (!formData.syntax.trim()) {
      newErrors.syntax = "Syntax is required";
    }

    setErrors(newErrors);

    return (
      !newErrors.title &&
      !newErrors.code &&
      !newErrors.interviewAnswer &&
      !newErrors.syntax
    );
  };

  // Format data before sending to backend
  const getFormattedData = () => ({
    title: formData.title.trim(),
    language: formData.language,
    code: formData.code.trim(),
    tags: formData.tagsString
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    isFavorite: formData.isFavorite,
    interviewAnswer: formData.interviewAnswer.trim(),
    syntax: formData.syntax.trim(),
  });

  return {
    formData,
    setFormData,
    errors,
    validate,
    getFormattedData,
  };
}