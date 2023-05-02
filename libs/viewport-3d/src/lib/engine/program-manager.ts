import * as twgl from "twgl.js";

class ProgramManager {
  private programs: Map<string, twgl.ProgramInfo> = new Map();
  addProgram(name: string, program: twgl.ProgramInfo) {
    this.programs.set(name, program);
  }

  getProgram(name: string): twgl.ProgramInfo | null {
    return this.programs.get(name) || null;
  }
}

export const programManager = new ProgramManager();
