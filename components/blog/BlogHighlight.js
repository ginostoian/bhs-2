import classes from "./BlogHighlight.module.css";
import BlogPostHighlight from "./BlogPostHighlight";

const BlogHighlight = ({ articles }) => {
  return (
    <div className={`${classes["blog-wrapper"]} container`}>
      {articles.map((article, index) => (
        <BlogPostHighlight
          key={index}
          article={article}
        />
      ))}
    </div>
  );
};

export default BlogHighlight;
