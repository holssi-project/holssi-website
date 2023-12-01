import { BuildData, Project, create, status } from "@/utils/fetch";
import { PayloadAction, ThunkAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";

type ProjectState = {
  project: Project | null;
  build_data: Partial<BuildData>;
}

const initialState: ProjectState = {
  project: null,
  build_data: {},
}

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    projectCreated: (state, action: PayloadAction<Project>) => {
      state.project = action.payload;
      state.build_data = {};
    },
    projectDataSavedStep1: (state, action: PayloadAction<Pick<BuildData, "name" | "nameEn" | "author" | "version" | "desc">>) => {
      state.build_data = {
        ...state.build_data,
        ...action.payload,
      }
    },
    projectDataSavedStep2: (state, action: PayloadAction<Pick<BuildData, "useBes" | "useBoostMode" | "platform" | "arch">>) => {
      state.build_data = {
        ...state.build_data,
        ...action.payload,
      }
    },
    projectUpdated: (state, action: PayloadAction<Project>) => {
      state.project = action.payload;
    },
  }
});

export function updateProject(): ThunkAction<void, RootState, unknown, any> {
  return async (dispatch, getState) => {
    let project_id = getState().project.project?.project_id;
    if (!project_id) return;
    let project = await status(project_id);
    dispatch(projectUpdated(project));
  }
}

export const { projectCreated, projectDataSavedStep1, projectDataSavedStep2, projectUpdated } = projectSlice.actions;

export default projectSlice.reducer;