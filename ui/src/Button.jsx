function Button({
  'class': className = '',
  onClick,
  children,
}) {
  return (
    <div class="h-fit w-fit rounded-md hover:cursor-pointer shadow-sm hover:shadow-md hover:outline hover:outline-2 hover:outline-dashed hover:outline-blue-500">
      <button
        onClick={onClick}
        class={`font-bold text-black border-2 border-solid border-gray-200 rounded-md shadow-md ${className}`}
      >
        {children}
      </button>
    </div>
  );
}

export default Button;
