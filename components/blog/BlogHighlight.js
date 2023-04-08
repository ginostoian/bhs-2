import classes from "./BlogHighlight.module.css";
import BlogPostHighlight from "./BlogPostHighlight";

const BlogHighlight = () => {
  return (
    <div className={`${classes["blog-wrapper"]} container`}>
      <BlogPostHighlight />
    </div>
  );
};

export default BlogHighlight;
