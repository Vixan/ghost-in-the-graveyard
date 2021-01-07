import React, { FC } from "react";
import styled, { css } from "styled-components";

interface ButtonProps {
  paused: boolean;
}

const Button = styled.button<{ paused: boolean }>`
  border: none;
  padding: 0.5rem;
  width: 10rem;
  border-radius: 10px;
  background-color: #1d1d20;
  color: #0dab76;
  cursor: pointer;
  opacity: 0.5;
  &:hover {
    opacity: 1;
  }

  ${({ paused }: ButtonProps) =>
    paused &&
    css`
      background-color: #ffee88;
      color: #000000;
    `}
`;

interface Props {
  paused: boolean;
  text?: string;
  onClick: () => void;
}

export const SimulationStatusButton: FC<Props> = ({
  onClick,
  paused,
  text = ""
}) => {
  return (
    <Button onClick={onClick} paused={paused}>
      {text}
    </Button>
  );
};
