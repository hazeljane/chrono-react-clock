
import { useEffect, useRef, useState } from "react";
import "./CustomDropdown.css";

export default function CustomDropdown({
  label,
  value,
  options,
  onChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  );

  const selectedOption = options[selectedIndex];

  // Close the menu when clicking outside.
  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, []);

  // Focus the active option when the menu opens or selection moves.
  useEffect(() => {
    if (isOpen) {
      optionRefs.current[activeIndex]?.focus();
    }
  }, [isOpen, activeIndex]);

  function openMenu(index = selectedIndex) {
    setActiveIndex(index);
    setIsOpen(true);
  }

  function chooseOption(option) {
    onChange(option.value);
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  function handleTriggerKeyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (!isOpen) {
        openMenu();
      } else {
        setActiveIndex((index) =>
          Math.min(index + 1, options.length - 1)
        );
      }
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (!isOpen) {
        openMenu();
      } else {
        setActiveIndex((index) => Math.max(index - 1, 0));
      }
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      if (!isOpen) {
        openMenu();
      }
    }

    if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  function handleOptionKeyDown(event, index) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex(Math.min(index + 1, options.length - 1));
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (index === 0) {
        setIsOpen(false);
        triggerRef.current?.focus();
      } else {
        setActiveIndex(index - 1);
      }
    }

    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(options.length - 1);
    }

    if (event.key === "Escape" || event.key === "Tab") {
      setIsOpen(false);
    }
  }

  return (
    <div className="custom-dropdown" ref={containerRef}>
      <label className="custom-dropdown__label">
        {label}
      </label>

      <button
        ref={triggerRef}
        type="button"
        className={`custom-dropdown__trigger ${
          isOpen ? "is-open" : ""
        }`}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
          } else {
            openMenu();
          }
        }}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className="custom-dropdown__selected">
          <span
            className="custom-dropdown__color"
            style={{
              backgroundColor: selectedOption?.color ?? "#D6A56C",
            }}
          />

          <span className="custom-dropdown__text">
            <span className="custom-dropdown__name">
              {selectedOption?.label ?? "Choose an option"}
            </span>

            {selectedOption?.description && (
              <span className="custom-dropdown__description">
                {selectedOption.description}
              </span>
            )}
          </span>
        </span>

        <svg
          className={`custom-dropdown__arrow ${
            isOpen ? "rotate" : ""
          }`}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="m6 9 6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <ul
          className="custom-dropdown__menu"
          role="listbox"
          aria-label={label}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;

            return (
              <li key={option.value} role="presentation">
                <button
                  ref={(element) => {
                    optionRefs.current[index] = element;
                  }}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`custom-dropdown__option ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() => chooseOption(option)}
                  onKeyDown={(event) =>
                    handleOptionKeyDown(event, index)
                  }
                >
                  <span
                    className="custom-dropdown__color"
                    style={{
                      backgroundColor: option.color ?? "#D6A56C",
                    }}
                  />

                  <span className="custom-dropdown__text">
                    <span className="custom-dropdown__name">
                      {option.label}
                    </span>

                    {option.description && (
                      <span className="custom-dropdown__description">
                        {option.description}
                      </span>
                    )}
                  </span>

                  {isSelected && (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="m5 12 4 4L19 6"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
