export type Generator<Config, State, Data> = {
  initial_state: (value: Data) => State;
  config: Config;
  next: (previous: {
    value: Data;
    state: State;
  }) => { value: Data; state: State; done?: boolean }[];
};
