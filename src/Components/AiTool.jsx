import { useState } from "react";

const aiTool = [
  { name: "ChatGPT", image: "https://play-lh.googleusercontent.com/lmG9HlI0awHie0cyBieWXeNjpyXvHPwDBb8MNOVIyp0P8VEh95AiBHtUZSDVR3HLe3A", link: "https://chat.openai.com" },
  { name: "Microsoft Copilot", image: "https://www.google.com/imgres?q=microsoft%20copilot&imgurl=https%3A%2F%2Fstatic.wikia.nocookie.net%2Fwindows%2Fimages%2F2%2F2a%2FMicrosoft_365_Copilot_Icon.svg%2Frevision%2Flatest%2Fthumbnail%2Fwidth%2F360%2Fheight%2F450%3Fcb%3D20231224232528&imgrefurl=https%3A%2F%2Fmicrosoft.fandom.com%2Fwiki%2FMicrosoft_Copilot&docid=B9OsdGjqwLsC9M&tbnid=ShHZCL7wynvmkM&vet=12ahUKEwjetZiU_aONAxW56jgGHae4K7wQM3oECC4QAA..i&w=360&h=450&hcb=2&ved=2ahUKEwjetZiU_aONAxW56jgGHae4K7wQM3oECC4QAA", link: "https://copilot.microsoft.com" },
  { name: "Stable Diffusion", image: "https://via.placeholder.com/100", link: "https://stablediffusionweb.com" },
];

const AITool = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTools = aiTool.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="text-center p-10">
      <h1 className="text-3xl font-bold">AI Tools</h1>
      <input
        type="text"
        placeholder="Search AI Tools..."
        className="border p-2 w-64 mt-4"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {filteredTools.map((tool, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-md">
            <img src={tool.image} alt={tool.name} className="mx-auto mb-2 w-24 h-24 rounded" />
            <h2 className="text-lg font-semibold">{tool.name}</h2>
            <a href={tool.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              Visit Site
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AITool;