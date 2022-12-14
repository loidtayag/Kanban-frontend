import { iBoard, iTask } from "../../utils/interfaces";
import styled from "styled-components";
import { textTheme, theme } from "../../styles/theme.styles";
import React, { MutableRefObject, useContext, useState } from "react";
import { getTotalDone } from "./ViewBoard";
import { InputModal, LabelModal } from "./OverlayModal";
import { ThemeContext } from "../../utils/context";

function ViewTask({
                    selectedBoard,
                    selectedTask,
                    data,
                    why
                  }: {
  selectedBoard: iBoard;
  selectedTask: iTask;
  data: MutableRefObject<{
    hack: string;
    selectedStatus: number;
    selectedTask: number;
  }>;
  why: {
    status: number;
    task: number;
    setTaskView: (value: boolean) => void;
  };
}) {
  let key = 0;
  data.current.hack = selectedBoard.status[why.status].name;

  return (
    <>
      <Title style={{ fontSize: "200%" }}>{selectedTask.title}</Title>
      <Desc>{selectedTask.desc}</Desc>
      <Subtask
        selectedBoard={selectedBoard}
        selectedTask={selectedTask}
        data={data}
        why={why}
      />
      <Title>Status</Title>
      <Status
        onBlur={(event: { currentTarget: { value: string; }; }) => {
          data.current.hack = event.currentTarget.value;
        }}
        defaultValue={justWhy(selectedBoard, why)}
      >
        {selectedBoard.status.map((status) => {
          return (
            <option
              key={key++}
              value={status.name}
              style={{ fontWeight: theme.textWeight }}
            >
              {status.name}
            </option>
          );
        })}
      </Status>
    </>
  );
}

function justWhy(
  selectedBoard: iBoard,
  why: {
    status: number;
    task: number;
    setTaskView: (value: boolean) => void;
  }
): string {
  let temp = "";
  selectedBoard.status.forEach((status) => {
    if (status.name === selectedBoard.status[why.status].name) {
      temp = status.name;
    }
  });
  return temp;
}

const Subtask = styled(
  ({
     selectedBoard,
     selectedTask,
     why
   }: {
    selectedBoard: iBoard;
    selectedTask: iTask;
    data: MutableRefObject<{
      hack: string;
      selectedStatus: number;
      selectedTask: number;
    }>;
    why: {
      status: number;
      task: number;
      setTaskView: (value: boolean) => void;
    };
  }) => {
    let otherKey = 0;
    const [checked, setChecked] = useState(false);

    return (
      <div style={{ marginBottom: "2ch" }}>
        <Title style={{ fontSize: "100%" }}>
          Subtasks ({getTotalDone(selectedTask)} of{" "}
          {selectedTask.subtasks.length})
        </Title>
        {selectedTask.subtasks.map((subtask) => {
          return (
            <div
              key={otherKey++}
              style={{
                display: "flex",
                alignItems: "center",
                position: "relative"
              }}
            >
              <InputModal
                type="checkbox"
                defaultChecked={subtask.finished}
                onChange={(event: React.FocusEvent<HTMLInputElement, Element>) => {
                  const index = selectedBoard.status[why.status].tasks[
                    why.task
                    ].subtasks.findIndex(
                    (subtask) =>
                      subtask.desc ===
                      event.target.nextElementSibling?.innerHTML
                  );
                  selectedBoard.status[why.status].tasks[why.task].subtasks[
                    index
                    ].finished =
                    !selectedBoard.status[why.status].tasks[why.task].subtasks[
                      index
                      ].finished;
                  setChecked(!checked);
                }}
                style={{
                  paddingRight: "10ch",
                  marginBottom: "0",
                  minWidth: "0%",
                  maxWidth: theme.iconSize,
                  marginRight: "0ch"
                }}
              ></InputModal>
              <LabelModal
                style={{
                  color: theme.textColor,
                  marginBottom: "0",
                  position: "relative",
                  wordWrap: "break-word",
                  maxWidth: "28vw",
                  left: "1ch"
                  // top: "1ch",
                }}
              >
                {selectedTask.subtasks[otherKey].desc}
              </LabelModal>
            </div>
          );
        })}
      </div>
    );
  }
)``;

const Title = styled.p`
  ${textTheme};
  color: ${() => useContext(ThemeContext)?.headers};
  font-size: 100%;
  margin-bottom: 0.3rem;
`;

const Desc = styled.p`
  ${textTheme};
  margin-bottom: 2rem;
  word-wrap: break-word;
`;

const Status = styled.select`
  height: 2.7rem;
  background-color: ${() => useContext(ThemeContext)?.form};
  border: 0.1rem solid ${theme.textColor};
  border-radius: 0.7rem;
  cursor: pointer;
  ${textTheme};
  color: ${theme.textColor};
  width: fit-content;
`;

export default ViewTask;
