import React, { FC } from "react";
import { ToggleButton } from "./ToggleButton";
import styled from "styled-components";

const ToggleWrapper = styled.div`
  display: flex;
  justify-items: center;
  gap: 16px;
  line-height: 1.2;
  color: #aaaaaa;
`;

interface Props {
  selected: boolean;
  onChange: () => void;
}

export const AgentsViewAreaToggle: FC<Props> = ({ selected, onChange }) => {
  return (
    <ToggleWrapper>
      <span>Display agents view area</span>
      <ToggleButton
        selected={selected}
        onChange={onChange}
        selectedText="✔"
        deselectedText=""
      />
    </ToggleWrapper>
  );
};
