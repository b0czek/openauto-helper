import "./ContentTiles.scss";
import "../index.scss";
import React from "react";
//#region RegularTile
const ContentTile = React.forwardRef((props, ref) => (
    <div
        className={mergeClasses(
            `contentTile contentTileLong unselectable`,
            props
        )}
        ref={ref}>
        {props.children}
    </div>
));

const ContentTileContent = (props) => (
    <div className={mergeClasses("contentTileContent centerChildren", props)}>
        {props.children}
    </div>
);
const ContentTileText = (props) => (
    <div className="contentTileTextContainer">
        <span className={mergeClasses("contentTileText", props)}>
            {props.children}
        </span>
    </div>
);
//#endregion RegularTile

//#region ShortTile
const ContentTileShort = React.forwardRef((props, ref) => (
    <div
        className={mergeClasses(
            "contentTile contentTileShort unselectable",
            props
        )}
        ref={ref}>
        {props.children}
    </div>
));
const ShortTileText = (props) => (
    <div className={mergeClasses("contentTileShortText", props)}>
        {props.children}
    </div>
);

const ShortTileContent = (props) => (
    <div
        className={mergeClasses(
            "contentTileShortContent centerChildren",
            props
        )}>
        {props.children}
    </div>
);
//#endregion ShortTile

export const ShortTile = {
    ...ContentTileShort,
    Text: ShortTileText,
    Content: ShortTileContent,
};
const ContentTiles = {
    ...ContentTile,
    Content: ContentTileContent,
    Text: ContentTileText,
    Short: ShortTile,
};
export default ContentTiles;

const mergeClasses = (classNames, props) =>
    `${classNames} ${props.className ? props.className : ""}`;
