
import PropTypes from "prop-types";
import React from "react";
import MaskedInput from "react-text-mask";

const IDNumberMask = (props)=> {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[/[1-3]/,
      " ",
      /[1-2]/,
      /[0|9]/,
      /\d/,
      /\d/,
      " ",
      /[7-8]/,
      " ",
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      " ",
      /\d/,
      " ",
      /\d/,
      /\d/,]}
      placeholderChar={"\u2000"}
      guide
      keepCharPositions
    />
  );
}

IDNumberMask.propTypes = {
  inputRef: PropTypes.func.isRequired
};

export default IDNumberMask;