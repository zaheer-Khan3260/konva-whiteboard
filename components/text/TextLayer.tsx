import { Layer } from "react-konva";
import { CanvasObjectType } from "../Canvas";
import TextField from "./TextField";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  setLineSpacing,
  setTextAlignment,
  setTextColor,
  setTextSize,
  setTextStyle,
} from "@/redux/textSlice";
import { convertTextPropertiesToTextStyleArray } from "./textUtils";

type Props = {
  objects: CanvasObjectType[];
  newObject: CanvasObjectType | null;
  selectedObjectId: string;
  setSelectedObjectId: (id: string) => void;
  onChange: (
    newAttrs: Partial<CanvasObjectType>,
    selectedObjectId: string,
  ) => void;
  setSidePanelVisible: (isVisible: boolean) => void;
  onTextChange: (newText: string, objectId: string) => void;
  onTextStyleChange: (style: Partial<CanvasObjectType>, objectId: string) => void; // Add this prop
};

export default function TextLayer({
  objects,
  newObject,
  selectedObjectId,
  setSelectedObjectId,
  onChange,
  setSidePanelVisible,
  onTextChange,
  onTextStyleChange, // Add this prop
}: Props) {
  const dispatch = useDispatch();

  const { selectedTool } = useSelector((state: RootState) => state.canvas);

  const texts = [
    ...objects.filter((obj: CanvasObjectType) => obj.type === "text"),
    ...(newObject && newObject.type === "text" ? [newObject] : []),
  ];

  return (
    <Layer>
      {texts.map((text, _) => (
        <TextField
          key={text.id}
          objectProps={text}
          isSelected={text.id === selectedObjectId}
          onSelect={(e) => {
            if (selectedTool === "select") {
              setSelectedObjectId(text.id);

              // Open side panel
              setSidePanelVisible(true);

              // update settings to match selected text's
              dispatch(setTextSize(text.fontSize || 28));
              dispatch(setTextColor(text.fill || "#000"));
              dispatch(setTextAlignment(text.align || "left"));
              dispatch(setLineSpacing(text.lineHeight || 1.5));
              dispatch(
                setTextStyle(
                  convertTextPropertiesToTextStyleArray(
                    text.fontStyle,
                    text.textDecoration,
                  ),
                ),
              );

              // Update cursor style
              const stage = e.target.getStage();
              if (stage) {
                const container = stage.container();
                container.style.cursor = "grab";
              }
            }
          }}
          onChange={(newAttrs: Partial<CanvasObjectType>) =>
            onChange(newAttrs, text.id)
          }
          onTextChange={(newText) => onTextChange(newText, text.id)}
          onTextStyleChange={(style) => onTextStyleChange(style, text.id)} // Pass this prop
        />
      ))}
    </Layer>
  );
}
