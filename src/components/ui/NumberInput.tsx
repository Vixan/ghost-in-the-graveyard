import React, { ChangeEvent, FC } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: inline-flex;
  justify-items: center;
  color: #aaaaaa;
  gap: 16px;
  line-height: 1.8;
`;

const ButtonWrapper = styled.div`
  display: inline-flex;
`;

const Input = styled.input`
  appearance: textfield;
  border: none;
  background-color: #1d1d20;
  color: #ffffff;
  padding: 0.5rem;
  text-align: center;

  opacity: 0.5;
  &:hover {
    opacity: 1;
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }

  &:disabled {
    opacity: 0.2;
  }
`;

const Button = styled.button`
  border: none;
  width: 32px;
  height: 32px;
  font-size: 1.1rem;
  background-color: #1d1d20;
  color: #ffffff;
  cursor: pointer;
  opacity: 0.5;
  
  &:hover {
    opacity: 1;
  }
  &:disabled {
    opacity: 0.2;
  }
`;

const DecrementButton = styled(Button)`
  border-radius: 99px 0 0 99px;
`;

const IncrementButton = styled(Button)`
  border-radius: 0 99px 99px 0;
`;

interface Props {
  value: number;
  minValue: number;
  maxValue: number;
  label?: string;
  disabled?: boolean;
  onClickIncrement: () => void;
  onClickDecrement: () => void;
  onChange: (value: number) => void;
}

export const NumberInput: FC<Props> = ({
  value,
  minValue,
  maxValue,
  label,
  disabled = false,
  onClickIncrement,
  onClickDecrement,
  onChange
}) => {
  const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);

    if (isNaN(value)) {
      return;
    }

    onChange(
      value < minValue
        ? Math.max(value, minValue)
        : value > maxValue
        ? Math.min(value, maxValue)
        : value
    );
  };

  return (
    <Wrapper>
      {label}
      <ButtonWrapper>
        <DecrementButton onClick={onClickDecrement} disabled={disabled}>−</DecrementButton>
        <Input
          type="number"
          min={minValue}
          max={maxValue}
          value={value}
          onChange={onChangeValue}
          disabled={disabled}
        />
        <IncrementButton onClick={onClickIncrement} disabled={disabled}>+</IncrementButton>
      </ButtonWrapper>
    </Wrapper>
  );
};
