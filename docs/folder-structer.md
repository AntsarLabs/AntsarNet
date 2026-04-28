# STRUCTURE

```txt
src/
├── app/
│   ├── providers.tsx        # ✅ React Query provider
│   ├── router.tsx
│   └── init.tsx             # ✅ app bootstrap (auth sync)
│
├── features/
│   ├── auth/
│   │   ├── api.ts
│   │   ├── store.ts         # ✅ Zustand here
│   │   ├── components/
│   │   └── types.ts
│   │
│   ├── todos/
│   │   ├── api.ts
│   │   ├── hooks.ts         # ✅ React Query here
│   │   ├── components/
│   │   └── types.ts
│
├── lib/
│   ├── supabase.ts
│
├── pages/
├── main.tsx
```

👉 Notice:

* ❌ removed old `auth/hooks.ts`
* ❌ removed manual state in todos
* ✅ added `store.ts` (Zustand)
* ✅ React Query handles data

---

# ⚡ 1. PROVIDERS (React Query)

`src/app/providers.tsx`

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

---

# 🔐 2. AUTH → ZUSTAND (clean + global)

## `features/auth/store.ts`

```ts
import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),

  fetchUser: async () => {
    const { data } = await supabase.auth.getUser()
    set({ user: data.user, loading: false })
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null })
  },
}))
```

---

## 🔄 App Init (important)

`src/app/init.tsx`

```tsx
import { useEffect } from "react"
import { useAuthStore } from "@/features/auth/store"

export function AppInit({ children }) {
  const fetchUser = useAuthStore((s) => s.fetchUser)

  useEffect(() => {
    fetchUser()
  }, [])

  return children
}
```

---

## ✏️ Update AuthForm (no reload hack)

```tsx
import { useState } from "react"
import { signIn, signUp } from "../api"
import { useAuthStore } from "../store"

export function AuthForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const fetchUser = useAuthStore((s) => s.fetchUser)

  const handleLogin = async () => {
    await signIn(email, password)
    await fetchUser()
  }

  const handleSignup = async () => {
    await signUp(email, password)
    alert("Check email")
  }

  return (
    <div>
      <input onChange={(e) => setEmail(e.target.value)} />
      <input type="password" onChange={(e) => setPassword(e.target.value)} />

      <button onClick={handleLogin}>Login</button>
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  )
}
```

---

# 📝 3. TODOS → TANSTACK QUERY

## `features/todos/hooks.ts`

```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTodos, addTodo, deleteTodo } from './api'

export function useTodos() {
  return useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
  })
}

export function useAddTodo() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}

export function useDeleteTodo() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}
```

---

## ✏️ Update Dashboard

```tsx
import { useTodos, useAddTodo, useDeleteTodo } from "@/features/todos/hooks"
import { useAuthStore } from "@/features/auth/store"
import { AddTodo } from "@/features/todos/components/AddTodo"
import { TodoList } from "@/features/todos/components/TodoList"

export default function Dashboard() {
  const { data: todos, isLoading } = useTodos()
  const add = useAddTodo()
  const del = useDeleteTodo()
  const logout = useAuthStore((s) => s.logout)

  if (isLoading) return <p>Loading...</p>

  return (
    <div>
      <button onClick={logout}>Logout</button>

      <AddTodo onAdd={(title) => add.mutate(title)} />
      <TodoList
        todos={todos || []}
        onDelete={(id) => del.mutate(id)}
      />
    </div>
  )
}
```

---

# 🚦 4. ROUTER (cleaner now)

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "@/pages/Login"
import Dashboard from "@/pages/Dashboard"
import { useAuthStore } from "@/features/auth/store"

export function AppRouter() {
  const { user, loading } = useAuthStore()

  if (loading) return <p>Loading...</p>

  return (
    <BrowserRouter>
      <Routes>
        {!user ? (
          <Route path="*" element={<Login />} />
        ) : (
          <Route path="*" element={<Dashboard />} />
        )}
      </Routes>
    </BrowserRouter>
  )
}
```

---

# 🚀 5. main.tsx (final glue)

```tsx
import React from "react"
import ReactDOM from "react-dom/client"
import { AppRouter } from "./app/router"
import { Providers } from "./app/providers"
import { AppInit } from "./app/init"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers>
      <AppInit>
        <AppRouter />
      </AppInit>
    </Providers>
  </React.StrictMode>
)
```

---