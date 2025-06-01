// src/components/NewsSection.tsx
import React from "react";

export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  url?: string;
}

interface NewsSectionProps {
  items: NewsItem[];
}

const NewsSection: React.FC<NewsSectionProps> = ({ items }) => {
  return (
    <section className="news-section">
      <h2 className="news-title">Noticias y Avisos Importantes</h2>
      <div className="news-wrapper">
        {/* Contenedor izquierdo para publicidad */}
        <aside className="ad-container ad-left">
          <div className="ad-content">
            <h3 className="ad-title">Publicidad</h3>
            <p className="ad-text">
              Espacio disponible para banner o enlace de patrocinador.
            </p>
            {/* Aquí podrías insertar un <img> o un <iframe> para anuncios reales */}
          </div>
        </aside>

        {/* Contenedor central con las noticias */}
        <div className="news-list-container">
          {items.map((item) => (
            <article key={item.id} className="news-card">
              <h3 className="news-card-title">{item.title}</h3>
              <p className="news-card-summary">{item.summary}</p>
              {item.url && (
                <a href={item.url} className="news-card-link">
                  Ver más
                </a>
              )}
            </article>
          ))}
        </div>

        {/* Contenedor derecho para publicidad */}
        <aside className="ad-container ad-right">
          <div className="ad-content">
            <h3 className="ad-title">Publicidad</h3>
            <p className="ad-text">
              Otro espacio para banner o enlace de patrocinador.
            </p>
            {/* Aquí también podrías insertar tu banner / imagen publicitaria */}
          </div>
        </aside>
      </div>
    </section>
  );
};

export default NewsSection;
