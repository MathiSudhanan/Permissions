import React, { useCallback, useEffect, useState } from "react";

const TriStateSwitch = ({
  defaultValue,
  item,

  updateStat,
}) => {
  const [value, setValue] = useState(defaultValue);
  const [spanId, setSpanId] = useState(item ? item.statId : null);

  useEffect(() => {
    setValue(value);
    setView(value, false);
  }, [defaultValue, item?.statId]);

  const setView = useCallback(
    (value) => {
      const element: HTMLElement | null = document.getElementById(spanId);
      let backgroundColor = "";
      if (element) {
        const parentElement: HTMLElement | null = element.parentElement;

        switch (value) {
          case true:
          case 1: //permissioned
            backgroundColor = "rgb(128, 203, 196)"; //green
            element.style.marginLeft = "11px";
            element.style.backgroundColor = "rgb(38, 166, 154)";
            element.style.borderColor = "#004D40";
            element.innerText = "P";
            element.style.color = "#fff";

            break;

          case false:
          case 0: //non-permissioned
            backgroundColor = "rgb(239, 154, 154)";
            element.style.marginLeft = "-22px";
            element.style.backgroundColor = "rgb(239, 83, 80)";
            element.style.borderColor = "#B71C1C";
            element.innerText = "NP";

            element.style.color = "#fff";
            value = 0;

            break;
          default: //not-set
            //grey
            backgroundColor = "rgb(117, 117, 117)";
            element.style.marginLeft = "0px";
            element.style.backgroundColor = "#fff";
            element.style.borderColor = "#757575";
            element.innerText = "N/A";
            element.style.color = "#000";
            value = -1;

            break;
        }

        if (parentElement) {
          parentElement.style.backgroundColor = backgroundColor;
        }
      }
    },
    [value, spanId]
  );

  const handleClick = (event) => {
    const element: HTMLElement = event.target;

    const parentElement: HTMLElement | null = element.parentElement;

    if (parentElement) {
      element.style.transition = "all 1s ease";
      switch (value) {
        case false:
        case 0:
          if (item?.id === "") {
            setValue(-1);
            setView(-1);
            updateStat(item, -1);
          } else {
            setValue(1);
            setView(1);
            updateStat(item, 1);
          }
          break;

        case true:
        case 1:
          setValue(0);
          setView(0);
          updateStat(item, 0);

          break;
        default:
          setValue(1);
          setView(1);
          updateStat(item, 1);

          break;
      }
    }
  };

  return (
    <div
      style={{
        height: "38px",
        width: "45px",
        margin: "14px",
        marginTop: "24px",
      }}
    >
      <span
        style={{
          backgroundColor: "#757575",
          height: "15px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "20px",
          marginTop: "10px",
        }}
      >
        <span
          id={spanId}
          style={{
            backgroundColor: "#fff", //"#3498db",
            height: "25px",
            width: "30px",
            borderRadius: "24px",
            border: "solid 1px",
            borderColor: "#757575",
            cursor: "pointer",
            display: "block",
            textAlign: "center",

            opacity: "100%",
            marginLeft: "0px",

            paddingTop: "5px",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={handleClick}
        >
          N/A
        </span>
      </span>
    </div>
  );
};

export default TriStateSwitch;
