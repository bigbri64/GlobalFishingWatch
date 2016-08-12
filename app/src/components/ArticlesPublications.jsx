import React, { Component } from 'react';
import CoverPrimary from './Shared/CoverPrimary';
import Footer from './Shared/Footer';

class ArticlesPublications extends Component {

  componentDidMount() {
    this.props.getArticlesPublicationsEntries();
  }

  renderElement(articlePublication) {
    return (
      <article key={articlePublication.link}>
        <h4><a href={articlePublication.link} target="_blank">{articlePublication.title}</a></h4>
        <span>{articlePublication.subtitle}</span>
      </article>
    );
  }

  render() {
    const articlesPublications = this.props.articlesPublications;
    let pageContent = [];

    if (articlesPublications && articlesPublications.articles) {
      const articles = articlesPublications.articles.map(this.renderElement);

      if (articles && articles.length) {
        pageContent.push(
          <section key="articles">
            <h2>Articles</h2>
            {articles}
          </section>
        );
      }
    }

    if (articlesPublications && articlesPublications.publications) {
      const publications = articlesPublications.publications.map(this.renderElement);

      if (publications && publications.length) {
        pageContent.push(
          <section key="publications">
            <h2>Publications</h2>
            {publications}
          </section>
        );
      }
    }

    if (!pageContent.length) {
      pageContent = (<div>Loading....</div>);
    }

    return (<div>
      <CoverPrimary
        title="Articles and Publications"
        subtitle="lorem ipsum"
      />
      <section>
        {pageContent}
      </section>
      <Footer />
    </div>);
  }
}

ArticlesPublications.propTypes = {
  articlesPublications: React.PropTypes.object,
  getArticlesPublicationsEntries: React.PropTypes.func
};

export default ArticlesPublications;
