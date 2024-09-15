function Button({
  'class': className = '',
  onClick,
  children,
}) {
  return (
    <div class="h-fit w-fit rounded-md hover:cursor-pointer shadow-sm hover:shadow-lg">
      <button
        onClick={onClick}
        class={`font-bold text-black border-2 border-solid border-gray-200 rounded-md ${className}`}
      >
        {children}
      </button>
    </div>
  );
}

export default Button;
