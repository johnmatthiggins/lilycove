function Button({
  'class': className = '',
  onClick,
  children,
}) {
  return (
    <div class="bg-black h-fit w-fit rounded-md hover:cursor-pointer shadow-md">
      <button
        onClick={onClick}
        class={`font-bold text-black hover:opacity-80 ${className}`}
      >
        {children}
      </button>
    </div>
  );
}

export default Button;
