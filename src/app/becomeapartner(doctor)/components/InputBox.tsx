import React from 'react'

const InputBox = ({ icon: Icon, placeholder, type = "text" }) => {
  return (
    <div className="flex h-[45px] items-center rounded-xl border border-slate-200 bg-white px-3">
      <Icon className="mr-2 h-4 w-4 text-slate-400" />
      <input
        type={type}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
      />
    </div>
  )
}

export default InputBox

