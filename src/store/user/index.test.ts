import { useUserStore } from './index'

const initialState = useUserStore.getState()

describe('useUserStore', () => {
  beforeEach(() => {
    useUserStore.setState(initialState, true)
  })

  it('exposes the initial state', () => {
    expect(useUserStore.getState()).toEqual({
      name: '',
      age: 0,
      isLoggedIn: false,
    })
  })

  it('updates state via setState', () => {
    useUserStore.setState({ name: 'Ada', age: 36, isLoggedIn: true })

    expect(useUserStore.getState()).toEqual({
      name: 'Ada',
      age: 36,
      isLoggedIn: true,
    })
  })

  it('supports partial updates', () => {
    useUserStore.setState({ name: 'Linus' })

    expect(useUserStore.getState()).toEqual({
      name: 'Linus',
      age: 0,
      isLoggedIn: false,
    })
  })
})
