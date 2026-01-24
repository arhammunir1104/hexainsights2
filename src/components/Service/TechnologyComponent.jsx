import React, { useState } from 'react';

// Technology data with categories and logos
const technologies = [
  { name: 'JavaScript', category: 'Frontend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-plain.svg' },
  { name: 'React', category: 'Frontend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'Vue.js', category: 'Frontend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-plain.svg' },
  { name: 'Express', category: 'Backend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
  { name: 'HTML5', category: 'Frontend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-plain.svg' },
  { name: 'Node.js', category: 'Backend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-plain.svg' },
  { name: 'Java', category: 'Backend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-plain.svg' },
  { name: 'Python', category: 'Backend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-plain.svg' },
  { name: 'PHP', category: 'Backend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-plain.svg' },
  { name: 'C#', category: 'Backend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-plain.svg' },
  { name: 'Angular', category: 'Frontend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-plain.svg' },
//   { name: 'Laravel', category: 'Frameworks', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-plain.svg' },
  { name: 'WordPress', category: 'CMS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg' },
//   { name: 'MySQL', category: 'Database', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-plain.svg' },
  { name: 'PostgreSQL', category: 'Database', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-plain.svg' },
  { name: 'MongoDB', category: 'Database', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-plain.svg' },
  { name: 'AWS', category: 'DevOps', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg' },
  { name: 'Docker', category: 'DevOps', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-plain.svg' },
  { name: 'Azure', category: 'Cloud', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-plain.svg' },
  { name: 'Google Cloud', category: 'Cloud', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-plain.svg' },
  { name: 'TensorFlow', category: 'Machine Learning', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg' },
  { name: 'Python (for Data Science)', category: 'Data Science', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-plain.svg' },
//   { name: 'Shopify', category: 'ECommerce', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/shopify/shopify-original.svg' }
];

const TechnologyComponent = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(technologies.map(tech => tech.category))];

  const filteredTechnologies = selectedCategory === 'All'
    ? technologies
    : technologies.filter(tech => tech.category === selectedCategory);

  return (
    <div className="bg-white text-gray-800 font-sans p-8 lg:p-16">
      {/* Top Section */}
      <div className="text-center mb-8 lg:mb-12">
        {/* <h1 className="text-2xl lg:text-4xl font-bold text-blue-800 mb-4">
          TECHNOLOGIES WE USED
        </h1> */}
        <h1 className="font-[Quicksand] text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 bg-clip-text text-transparent mb-4">
        TECHNOLOGIES WE USED
        </h1>
        <p className="text-gray-500 max-w-4xl mx-auto leading-relaxed">
          Using the right technology for the right problem is our mantra. We are agile about learning new processes and tools to save time and reduce complexity.
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 lg:mb-12">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 text-sm rounded-full transition-all cursor-pointer duration-300 ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-white hover:bg-gray-400 hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Technology Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-8">
        {filteredTechnologies.map(tech => (
          <div
            key={tech.name}
            className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-md transform transition-transform duration-300 hover:scale-105"
          >
            <img src={tech.logo} alt={`${tech.name} logo`} className="w-16 h-16 mb-2" />
            <span className="text-sm font-semibold text-gray-800 text-center">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechnologyComponent;