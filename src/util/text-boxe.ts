import { DirectionType, PageType } from "@/shared";
import { flattenDeep } from "lodash-es";

const getRelativeBoxDimensions = ({
  box,
  width,
  height,
}: {
  box: string;
  width: number;
  height: number;
}) => {
  const [boxLeft, boxTop, boxWidth, boxHeight] = box.split(" ");
  const relativeBoxLeft = (Number(boxLeft) / width) * 100;
  const relativeBoxTop = (Number(boxTop) / height) * 100;
  const relativeBoxWidth = (Number(boxWidth) / width) * 100;
  const relativeBoxHeight = (Number(boxHeight) / height) * 100;

  return {
    relativeBoxLeft,
    relativeBoxTop,
    relativeBoxWidth,
    relativeBoxHeight,
  };
};

export type Box = {
  type: "text" | "image";
  relativeBoxLeft: number;
  relativeBoxTop: number;
  relativeBoxWidth: number;
  relativeBoxHeight: number;
  direction: DirectionType;
  boxText: string;
};

export type Page = Box[];

export type Pages = Page[];

export const getPagesWithBoxes = (documentData: PageType[]): Pages => {
  return documentData?.map(({ parts, width, height }) => {
    const arrayOfBox: Page = flattenDeep(
      parts.map(({ type, lines, direction, box: partBox, rows }) => {
        if (lines && direction) {
          return lines.map(({ box: lineBox, text: boxText }) => {
            const {
              relativeBoxLeft,
              relativeBoxTop,
              relativeBoxWidth,
              relativeBoxHeight,
            } = getRelativeBoxDimensions({ box: lineBox, width, height });

            return {
              type,
              relativeBoxLeft,
              relativeBoxTop,
              relativeBoxWidth,
              relativeBoxHeight,
              direction,
              boxText,
            };
          });
        } else if (rows) {
          const rowBoxes = rows.map(({ columns }) => {
            const notEmptyColumns = columns.filter(
              (column) => Object.keys(column).length > 0,
            ); // some column has no data === {}
            const columnBoxes = notEmptyColumns.map(({ lines, direction }) => {
              const boxLines = lines?.map(({ box: partBox, text: boxText }) => {
                const {
                  relativeBoxLeft,
                  relativeBoxTop,
                  relativeBoxWidth,
                  relativeBoxHeight,
                } = getRelativeBoxDimensions({ box: partBox, width, height });

                return {
                  type: "text", // some senario like documents, api type is table but it needs to be text!
                  relativeBoxLeft,
                  relativeBoxTop,
                  relativeBoxWidth,
                  relativeBoxHeight,
                  direction,
                  boxText,
                };
              });

              return boxLines;
            });

            return columnBoxes;
          });

          return flattenDeep(rowBoxes);
        } else {
          const {
            relativeBoxLeft,
            relativeBoxTop,
            relativeBoxWidth,
            relativeBoxHeight,
          } = getRelativeBoxDimensions({ box: partBox, width, height });

          return {
            type,
            relativeBoxLeft,
            relativeBoxTop,
            relativeBoxWidth,
            relativeBoxHeight,
            direction: "ltr",
            boxText: "",
          };
        }
      }),
    ) as Page;

    return arrayOfBox;
  });
};
