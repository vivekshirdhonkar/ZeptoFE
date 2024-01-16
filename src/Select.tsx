import { useEffect, useRef, useState } from "react"
import styles from "./select.module.css"

export type SelectOption = {
  label: string
  value: string | number
}


type SelectProps = {
  options: SelectOption[]
  value: SelectOption[]
  onChange: (value: SelectOption[]) => void
} 

export function Select({ value, onChange, options }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState('');
  const [lastSelectedValue, setLastSelectedValue] = useState<string | number | null>(null);

 
  const containerRef = useRef<HTMLDivElement>(null)
  

  

  function clearOptions() {
     onChange([]) 
  }

  
  

  function selectOption(option: SelectOption) {
      if (value.includes(option)) {
        onChange(value.filter(o => o !== option))
        setLastSelectedValue(null);
      } else {
        onChange([...value, option])
        setSearchQuery('');
        setLastSelectedValue(null);
      }
  }



  function isOptionSelected(option: SelectOption) {
    return value.includes(option) 
  }
  const filteredOptions = options.filter(
    (option) =>
      !isOptionSelected(option) &&
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

 

  useEffect(() => {
    if (isOpen) setHighlightedIndex(0)
  }, [isOpen])



  useEffect(() => {
    console.log("hi")
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "Enter":
          setIsOpen((prev) => !prev);
          if (isOpen && filteredOptions.length > 0) {
            selectOption(filteredOptions[highlightedIndex]);
          }
          break;
        
          case "Backspace":
          if (searchQuery === "" && value.length > 0) {
            if (lastSelectedValue !== null) {
              // Remove the last item
              const lastSelectedOption = options.find((opt) => opt.value === lastSelectedValue);
              if (lastSelectedOption) {
                selectOption(lastSelectedOption);
              }
            } else {
              // Highlight the last selected item
              setLastSelectedValue(value[value.length - 1]?.value || null);
            }
          }
          break;
        case "ArrowUp":
        case "ArrowDown":
          if (!isOpen) {
            setIsOpen(true);
          }

          const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
          if (newValue >= 0 && newValue < filteredOptions.length) {
            setHighlightedIndex(newValue);
          }
          break;
        case "Escape":
          setIsOpen(false);
          break;
      }
    };

    const containerElement = containerRef.current;
    containerElement?.addEventListener("keydown", handleKeyDown);

    return () => {
      containerElement?.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, highlightedIndex, filteredOptions]);

 


  return (
    <div
      ref={containerRef}
      onClick={() => setIsOpen(prev => !prev)}
      tabIndex={0}
      className={styles.container}
    >
      <span className={styles.value}>
        {value.map((v) => (
              <button
                key={v.value}
                onClick={e => {
                  e.stopPropagation()
                  selectOption(v)
                }}
                className={`${styles["option-badge"]} ${v.value === lastSelectedValue ? styles["highlightedBadge"] : ""}`}
              >
                {v.label}
                <span className={styles["remove-btn"]}>&times;</span>
              </button>
            ))
          }
      </span>
      <div className={styles.searchContainer}>
  <input
    type="text"
    value={searchQuery} 
    onChange={(event)=>{
      event.stopPropagation()
      setIsOpen(true)

      setSearchQuery(event.target.value);}} 
    placeholder="Search options..."
  />
</div>
     
      <button
        onClick={e => {
          e.stopPropagation()
          clearOptions()
        }}
        className={styles["clear-btn"]}
      >
        &times;
      </button>
      <div className={styles.divider}></div>
      <div className={styles.caret}></div>
      <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
        {filteredOptions.map((option, index) => (
          <li
            onClick={e => {
              e.stopPropagation()
              selectOption(option)
              setIsOpen(false)
            }}
            onMouseEnter={() => setHighlightedIndex(index)}
            key={option.value}
            className={`${styles.option} ${
              isOptionSelected(option) ? styles.selected : ""
            } ${index === highlightedIndex ? styles.highlighted : ""}`}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  )
}