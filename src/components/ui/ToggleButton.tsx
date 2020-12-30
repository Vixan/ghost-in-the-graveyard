import { FC } from "react";
import styled, { css } from "styled-components";

interface Props {
  selected: boolean;
  onChange: () => void;
  selectedText?: string;
  deselectedText?: string;
  disabled?: boolean;
}

const ToggleWrapper = styled.div`
  width: 36px;
  background-color: #1d1d20;
  cursor: pointer;
  user-select: none;
  border-radius: 50px;
  padding: 4px;
  height: 16px;
  position: relative;
  display: inline-flex;
  align-items: center;

  opacity: 0.5;
  &:hover {
    opacity: 1;
  }
`;

const InnerButton = styled.div<{ selected: boolean }>`
  height: 16px;
  width: 16px;
  font-size: 0.5rem;
  cursor: pointer;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: unset;
  box-sizing: border-box;
  position: absolute;
  transition: all 0.3s ease;
  background-color: #35363a;
  left: 4px;
  color: #ffffff;

  ${({ selected }: { selected: boolean }) =>
    selected &&
    css`
      left: 24px;
      background-color: #0dab76;
    `}
`;

export const ToggleButton: FC<Props> = ({
  selected,
  onChange,
  selectedText = "",
  deselectedText = ""
}) => {
  return (
    <ToggleWrapper onClick={onChange}>
      <InnerButton selected={selected}>
        {selected ? selectedText : deselectedText}
      </InnerButton>
    </ToggleWrapper>
  );
};
