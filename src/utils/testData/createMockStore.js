export const createMockStore = () => ({
  getState: jest.fn(() => ({})),
  dispatch: jest.fn(),
  subscribe: jest.fn()
})

export default createMockStore
