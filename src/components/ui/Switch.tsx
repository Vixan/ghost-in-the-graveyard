import React, { FC } from "react";
import styled, { css } from "styled-components";

const SwitchWrapper = styled.div`
  display: flex;
  justify-items: center;
  gap: 16px;
  line-height: 1.2;
  color: #aaaaaa;
`;

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
  color: #35363a;
  font-weight: bold;

  ${({ selected }: { selected: boolean }) =>
    selected &&
    css`
      left: 24px;
      background-color: #0dab76;
    `}
`;

interface Props {
  selected: boolean;
  onChange: () => void;
  label?: string;
}

export const Switch: FC<Props> = ({ selected, onChange, label }) => {
  return (
    <SwitchWrapper>
      <span>{label}</span>
      <ToggleWrapper onClick={onChange}>
        <InnerButton selected={selected}>{selected ? "✔" : ""}</InnerButton>
      </ToggleWrapper>
    </SwitchWrapper>
  );
};
