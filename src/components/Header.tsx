import React, { useState } from "react";

interface Props {
  changeBackgroundColor: (color: string) => void;
}

function Header(props: Props) {
  const { changeBackgroundColor } = props;
  const [palette, setPalette] = useState<string[]>(['bg-red-400 text-white','bg-amber-200 text-black','bg-yellow-100 text-black','bg-gray-400 text-black','bg-orange-300 text-black',' bg-emerald-400 text-black','bg-gray-300 text-black','bg-lime-300 text-black']);

  const currentDate = new Date();
  const options:Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('en-US', options);

  return (
    <div className="flex flex-row justify-between p-2">
      <div className="text-3xl px-3 py-1 rounded-md italic">{formattedDate}</div>
      <div className="flex flex-row text-3xl gap-4">
        {palette.map((scheme) => (
          <button
            key={scheme}
            className={`p-6 rounded-full ${scheme} border-2 `}
            onClick={() => changeBackgroundColor(`${scheme}`)}
          >
            
          </button>
        ))}
      </div>
    </div>
  );
}

export default Header;
