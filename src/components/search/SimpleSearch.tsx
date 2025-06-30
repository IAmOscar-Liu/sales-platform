import { type FormEvent, useState } from "react";
import { useLocation } from "react-router-dom";
import { type SearchQueries } from "../../types/response";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SearchIcon, X } from "lucide-react";

function SimpleSearch({
  updateQueryValue,
  placeholder,
}: {
  updateQueryValue: (update: SearchQueries) => void;
  placeholder: string;
}) {
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const [textSearch, setTextSearch] = useState(() => {
    const query = params.get("textSearch");
    if (!query) return "";
    return query;
  });

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("text search: " + textSearch);
    if (!textSearch)
      updateQueryValue({
        textSearch: undefined,
        page: 1,
      });
    else
      updateQueryValue({
        textSearch: textSearch ? textSearch : undefined,
      });
  };

  return (
    <form className="flex items-center gap-2" onSubmit={handleSearchSubmit}>
      <div className="relative w-[250px]">
        <Input
          className="pe-8"
          value={textSearch}
          onChange={(e) => setTextSearch(e.target.value)}
          placeholder={placeholder}
        />
        {textSearch && (
          <X
            className="text-muted-foreground absolute top-[50%] right-3 size-4 translate-y-[-50%] cursor-pointer"
            onClick={() => setTextSearch("")}
          />
        )}
      </div>

      <Button size="icon">
        <SearchIcon />
      </Button>
    </form>
  );
}

export default SimpleSearch;
