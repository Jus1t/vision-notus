import React from "react";

const RenderDictionary = ({ data }) => {
  // Helper function to render items based on their type
  const renderItem = (item, key) => {
    if (Array.isArray(item)) {
      // Render arrays block by block
      return (
        <div
          key={key}
          style={{
            margin: "6px 0",
            padding: "10px",
            border: "1px solidrgb(8, 10, 10)",
            borderRadius: "5px",
          }}
        >
          <strong style={{ color: "#0D5C75" }}>{key}:</strong>
          <div>
            {item.map((subItem, index) => (
              <div
                key={index}
                style={{
                  margin: "3px 0",
                  padding: "5px",
                  border: "1px solid #A2D9E8",
                  borderRadius: "3px",
                }}
              >
                {renderItem(subItem, `${key}-${index}`)}
              </div>
            ))}
          </div>
        </div>
      );
    } else if (typeof item === "object" && item !== null) {
      // Render dictionaries as nested divs
      return (
        <div
          key={key}
          style={{
            margin: "10px 0",
            padding: "14px",
            border: "1px solid #4FB8CC",
            borderRadius: "6px",
          }}
        >
          <strong style={{ color: "#055A67", fontSize: "1.1em" }}>{key}:</strong>
          <div style={{ marginLeft: "10px" }}>{renderDictionary(item)}</div>
        </div>
      );
    } else {
      // Render atomic values directly
      return (
        <div
          key={key}
          style={{
            margin: "3px 0",
            padding: "5px",
            border: "1px solid #B2E4EA",
            borderRadius: "3px",
          }}
        >
          <strong style={{ color: "#0A3D4C" }}>{key}:</strong> {item}
        </div>
      );
    }
  };

  // Render dictionary by iterating over its keys
  const renderDictionary = (dict) => {
    return Object.entries(dict).map(([key, value]) => renderItem(value, key));
  };

  return (
    <div
      style={{
        padding: "18px",
        border: "1px solid #0486A7",
        borderRadius: "8px",
      }}
    >
      {renderDictionary(data)}
    </div>
  );
};

export default RenderDictionary;
