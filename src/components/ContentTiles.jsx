import "./ContentTiles.scss";
import React from "react";
const ContentTile = React.forwardRef((props, ref) => (
    <div
        className={mergeClasses(`contentTile contentTileLong`, props)}
        ref={ref}>
        {props.children}
    </div>
));

const ContentTileShort = (props) => (
    <div className={mergeClasses("contentTile contentTileShort", props)}>
        {props.children}
    </div>
);

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

const ContentTiles = {
    ...ContentTile,
    Short: ContentTileShort,
    Content: ContentTileContent,
    Text: ContentTileText,
};
export default ContentTiles;

const mergeClasses = (classNames, props) =>
    `${classNames} ${props.className ? props.className : ""}`;
