import React, { ChangeEvent, FC, useEffect, useRef } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: inline-flex;
  justify-items: center;
  color: #aaaaaa;
  gap: 16px;
  line-height: 1.8;
`;

const RangeIndicator = styled.div`
  position: absolute;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Range = styled.input`
  -webkit-appearance: none;
  appearance: none;
  opacity: 0.5;
  border-radius: 25px;
  background-color: #1d1d20;

  &:hover {
    opacity: 1;
  }
  &:focus {
    outline: none;
  }
  &:disabled {
    opacity: 0.2;
  }
  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 8px;
    cursor: pointer;
    background: #1d1d20;
    border-radius: 25px;
  }
  &::-webkit-slider-thumb {
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -4px;
  }
  &:focus::-webkit-slider-runnable-track {
    background: #1d1d20;
  }
`;

interface Props {
  value: number;
  minValue: number;
  maxValue: number;
  step?: number;
  label?: string;
  disabled?: boolean;
  onChange: (value: number) => void;
}

export const RangeInput: FC<Props> = ({
  value,
  onChange,
  minValue,
  maxValue,
  step = 1,
  disabled = false,
  label
}) => {
  const valueIndicatorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (valueIndicatorRef?.current && inputRef?.current) {
      const newValue = Number(
        ((value - minValue) * 100) / (maxValue - minValue)
      );
      const newPosition = 5 - newValue * 0.2;
      valueIndicatorRef.current.style.left = `calc(${newValue}% + (${newPosition}px))`;
    }
  });

  const onValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value));
  };

  return (
    <Wrapper>
      {label}

      <InputWrapper>
        <Range
          type="range"
          min={minValue}
          max={maxValue}
          step={step}
          value={value}
          onChange={onValueChange}
          ref={inputRef}
          disabled={disabled}
        />
        <RangeIndicator ref={valueIndicatorRef}>{value}</RangeIndicator>
      </InputWrapper>
    </Wrapper>
  );
};
