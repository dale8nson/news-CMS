import { useContext } from "react";
import { useAppSelector } from "@/lib/hooks";
import { setEditMode } from "@/lib/editor-layout-slice";

const EditorProvider = () => {
  const editMode = useAppSelector(state => state.editorLayoutSlice.editMode);
  
}