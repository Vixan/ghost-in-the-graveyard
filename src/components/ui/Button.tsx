import React, { FC } from "react";
import styled from "styled-components";

interface ButtonProps {
  color: string;
  backgroundColor: string;
}

const StyledButton = styled.button<ButtonProps>`
  border: none;
  padding: 0.5rem;
  width: 100%;
  border-radius: 10px;
  background-color: ${props => props.backgroundColor || "#ffffff"};
  color: ${props => props.color || "#ffffff"};
  cursor: pointer;
  user-select: none;
  opacity: 0.5;
  &:hover {
    opacity: 1;
  }
`;

interface Props {
  text?: string;
  onClick: () => void;

  backgroundColor: string;
  color: string;
}

export const Button: FC<Props> = ({
  onClick,
  text = "",
  ...buttonStyles
}) => {
  return (
    <StyledButton onClick={onClick} {...buttonStyles}>
      {text}
    </StyledButton>
  );
};
