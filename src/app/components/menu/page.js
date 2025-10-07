"use client";
import React, { useState } from "react";
import styled from "styled-components";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("Appetizers");

  const categories = [
    "Appetizers",
    "Soups & Salads",
    "Handhelds",
    "Sandwiches & More",
    "Fried Plates",
    "Entrees",
    "Pizzas",
    "Sides",
  ];

  return (
    <MenuSection>
      <MenuHeader>
        <h1>Our Menu</h1>
        <h2>Fresh Cape Cod flavors &amp; classic tavern favorites.</h2>
        <p>
          Now offering a late night menu from 9:00pm–11:00pm. Please call or stop
          in to try it!
        </p>
      </MenuHeader>

      <MenuNav>
        <NavInner>
          {categories.map((category) => (
            <NavItem
              key={category}
              active={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </NavItem>
          ))}
        </NavInner>
      </MenuNav>

      <MenuContent>
        {/* Appetizers */}
        {activeCategory === "Appetizers" && (
          <MenuCategory>
            <h2>Appetizers</h2>
            <div className="items">
              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Cod Bites</span>
                  <div className="item-line" />
                  <span className="item-price">$16.00</span>
                </div>
                <p className="item-desc">
                  Cod cut into bite-sized pieces, fried. Served with tartar
                  sauce and lemon.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Oysters</span>
                  <div className="item-line" />
                  <span className="item-price">MP</span>
                </div>
                <p className="item-desc">
                  Ice-cold Brewster oysters on the half shell with house
                  cocktail sauce and lemon.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Quahog</span>
                  <div className="item-line" />
                  <span className="item-price">$10.00</span>
                </div>
                <p className="item-desc">
                  A classic “stuffie”; chopped quahog, bell pepper, onion &
                  linguica in a toasted shell crowned with Old Bay-butter
                  crumbs.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Chicken Wings</span>
                  <div className="item-line" />
                  <span className="item-price">$15.00</span>
                </div>
                <p className="item-desc">
                  Crispy wings tossed in your choice of BBQ, classic Buffalo, or
                  sriracha; served with chilled blue-cheese dip and celery.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Garlic Bread</span>
                  <div className="item-line" />
                  <span className="item-price">$9.00 / $11.00</span>
                </div>
                <p className="item-desc">
                  Thick-cut homemade bread dressed with garlic butter. Option:
                  add cheese.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Fries</span>
                  <div className="item-line" />
                  <span className="item-price">$6.50 / $10.50</span>
                </div>
                <p className="item-desc">Parmesan truffle option available.</p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Sandbar Skins</span>
                  <div className="item-line" />
                  <span className="item-price">$13.00</span>
                </div>
                <p className="item-desc">
                  Crispy potato halves loaded with sharp cheddar, bacon and a
                  dollop of sour cream. + add lobster $12.
                </p>
              </MenuItem>
            </div>
          </MenuCategory>
        )}

        {/* Soups & Salads */}
        {activeCategory === "Soups & Salads" && (
          <MenuCategory>
            <h2>Soups &amp; Salads</h2>
            <p className="category-note">
              Add protein: Steak Tips $15, Salmon $14, Chicken $8, Lobster $18.
            </p>

            <div className="items">
              <MenuItem>
                <div className="item-info">
                  <span className="item-name">House Salad</span>
                  <div className="item-line" />
                  <span className="item-price">$13.00</span>
                </div>
                <p className="item-desc">
                  Mixed greens, red cabbage, carrots, cucumber, and a cherry
                  tomato.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Caesar Salad</span>
                  <div className="item-line" />
                  <span className="item-price">$16.00</span>
                </div>
                <p className="item-desc">
                  Classic Caesar served with cheese and homemade croutons.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Brewster Salad</span>
                  <div className="item-line" />
                  <span className="item-price">$19.00</span>
                </div>
                <p className="item-desc">
                  Greens, craisins, blue cheese, cucumbers and candied pecans
                  tossed in balsamic.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Greek Salad</span>
                  <div className="item-line" />
                  <span className="item-price">$18.00</span>
                </div>
                <p className="item-desc">
                  Greens, pepperoncini, roasted red onions, tomatoes and feta.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Wedge Salad</span>
                  <div className="item-line" />
                  <span className="item-price">$19.00</span>
                </div>
                <p className="item-desc">
                  Iceberg sliced in thirds, sliced boiled egg, blue cheese,
                  dressing, bacon, tomatoes and balsamic.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Homemade Clam Chowder</span>
                  <div className="item-line" />
                  <span className="item-price">$8.00 / $10.50</span>
                </div>
                <p className="item-desc">New England style; cup or bowl.</p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">French Onion Soup</span>
                  <div className="item-line" />
                  <span className="item-price">$10.00</span>
                </div>
              </MenuItem>
            </div>
          </MenuCategory>
        )}

        {/* Handhelds */}
        {activeCategory === "Handhelds" && (
          <MenuCategory>
            <h2>Handhelds</h2>
            <div className="items">
              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Lobster Roll</span>
                  <div className="item-line" />
                  <span className="item-price">$24.00</span>
                </div>
                <p className="item-desc">
                  Chilled knuckle-and-claw lobster lightly dressed in lemon-mayo
                  with celery, piled into a butter-toasted split-top brioche.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Fish Sandwich</span>
                  <div className="item-line" />
                  <span className="item-price">$19.00</span>
                </div>
                <p className="item-desc">
                  Crispy cod fillet, lettuce, onion &amp; tomato with tangy
                  tartar on a toasted brioche.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Mimi Burger</span>
                  <div className="item-line" />
                  <span className="item-price">$17.00</span>
                </div>
                <p className="item-desc">
                  8 oz flame-grilled burger with lettuce, onion &amp; tomato;
                  choice of cheese and bacon; on a brioche.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Fish Tacos</span>
                  <div className="item-line" />
                  <span className="item-price">$18.00</span>
                </div>
                <p className="item-desc">
                  Fried cod, shredded lettuce, pico de gallo, topped with lemon
                  mayo sauce.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Nashville Chicken Sandwich</span>
                  <div className="item-line" />
                  <span className="item-price">$18.00</span>
                </div>
                <p className="item-desc">
                  Buttermilk-fried chicken dipped, with pickles, lettuce, onion
                  &amp; tomato, provolone, bacon and coleslaw on brioche. Hot
                  sauce on the side.
                </p>
              </MenuItem>
            </div>
          </MenuCategory>
        )}

        {/* Sandwiches & More */}
        {activeCategory === "Sandwiches & More" && (
          <MenuCategory>
            <h2>Sandwiches and More</h2>
            <p className="category-note">
              All sandwiches come with cole slaw or potato salad.
            </p>
            <div className="items">
              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Italian Ground Sausage</span>
                  <div className="item-line" />
                  <span className="item-price">$16.00</span>
                </div>
                <p className="item-desc">
                  Sizzling crumbled Italian sausage in our homemade marinara,
                  finished under a blanket of cheese.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Sliced Meatball</span>
                  <div className="item-line" />
                  <span className="item-price">$17.00</span>
                </div>
                <p className="item-desc">
                  House meatballs sliced thick, simmered in rich marinara,
                  layered with cheese, and baked in a crusty roll.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Chicken Parmesan</span>
                  <div className="item-line" />
                  <span className="item-price">$16.00</span>
                </div>
                <p className="item-desc">
                  Crispy chicken cutlet, hearty marinara and golden melted
                  cheese in a warm grinder roll.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Eggplant Parmesan</span>
                  <div className="item-line" />
                  <span className="item-price">$15.00</span>
                </div>
                <p className="item-desc">
                  Lightly breaded eggplant slices with marinara and melted
                  cheese.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Philly Cheese Sub</span>
                  <div className="item-line" />
                  <span className="item-price">$17.00</span>
                </div>
                <p className="item-desc">
                  Choice of sliced steak or grilled chicken with sautéed onions,
                  peppers &amp; mushrooms, finished with melty cheese on a soft
                  hoagie.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Italian Cold Cut</span>
                  <div className="item-line" />
                  <span className="item-price">$16.00</span>
                </div>
                <p className="item-desc">
                  Salami, Genoa &amp; Mortadella with provolone, shredded
                  lettuce, ripe tomato, onion, and an oil-and-vinegar drizzle.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">BLT</span>
                  <div className="item-line" />
                  <span className="item-price">$15.00</span>
                </div>
                <p className="item-desc">
                  Crispy bacon, fresh lettuce, tomato and melted cheese on a
                  toasted sub roll.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Roast Beef Grinder</span>
                  <div className="item-line" />
                  <span className="item-price">$16.00</span>
                </div>
                <p className="item-desc">
                  House roasted, sliced in-house with provolone.
                </p>
              </MenuItem>
            </div>
          </MenuCategory>
        )}

        {/* Fried Plates */}
        {activeCategory === "Fried Plates" && (
          <MenuCategory>
            <h2>Fried Plates</h2>
            <div className="items">
              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Fried Shrimp</span>
                  <div className="item-line" />
                  <span className="item-price">$23.00</span>
                </div>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Fried Scallop Platter</span>
                  <div className="item-line" />
                  <span className="item-price">MP</span>
                </div>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Fish &amp; Chips</span>
                  <div className="item-line" />
                  <span className="item-price">$22.00</span>
                </div>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Chicken Finger Platter</span>
                  <div className="item-line" />
                  <span className="item-price">$16.00</span>
                </div>
              </MenuItem>
            </div>
          </MenuCategory>
        )}

        {/* Entrees */}
        {activeCategory === "Entrees" && (
          <MenuCategory>
            <h2>Entrees</h2>
            <div className="items">
              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Lobster Mac and Cheese</span>
                  <div className="item-line" />
                  <span className="item-price">$26.00</span>
                </div>
                <p className="item-desc">
                  Famous New England lobster with ziti, cheddar-cream and Ritz
                  baked.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Grilled Bourbon on Steak Tips</span>
                  <div className="item-line" />
                  <span className="item-price">$31.00</span>
                </div>
                <p className="item-desc">
                  Marinated tips char-grilled; served with garlic mashed potatoes
                  and seasonal vegetables.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Eggplant or Chicken Parmesan</span>
                  <div className="item-line" />
                  <span className="item-price">$24 / $26</span>
                </div>
                <p className="item-desc">
                  Crispy panko-breaded, baked with mozzarella &amp; house
                  marinara; over linguine.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Chicken Carbonara</span>
                  <div className="item-line" />
                  <span className="item-price">$26.00</span>
                </div>
                <p className="item-desc">
                  Pan-seared chicken over tortellini tossed in bacon, peas &amp;
                  Parmesan cream.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Chicken Piccata</span>
                  <div className="item-line" />
                  <span className="item-price">$27.00</span>
                </div>
                <p className="item-desc">
                  Lemon-caper white-wine butter sauce over chicken, rice and
                  seasonal vegetables.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Ribeye</span>
                  <div className="item-line" />
                  <span className="item-price">$38.00</span>
                </div>
                <p className="item-desc">
                  Ribeye finished with garlic butter; served with mashed potatoes
                  and vegetables of the day.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Shrimp Scampi</span>
                  <div className="item-line" />
                  <span className="item-price">$26.00</span>
                </div>
                <p className="item-desc">
                  Jumbo shrimp sautéed with garlic, wine, butter, tomatoes &
                  linguine, finished with lemon &amp; basil.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Pan Seared Scallops</span>
                  <div className="item-line" />
                  <span className="item-price">MP</span>
                </div>
                <p className="item-desc">
                  Day boat scallop with homemade garlic butter crust; served with
                  asparagus and mashed potato.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Baked Cod</span>
                  <div className="item-line" />
                  <span className="item-price">$27.00</span>
                </div>
                <p className="item-desc">
                  Tender cod topped with a Ritz-cracker &amp; roasted-garlic
                  butter crust, baked until golden; served with rice and seasonal
                  vegetables.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Mussels over Pasta</span>
                  <div className="item-line" />
                  <span className="item-price">MP</span>
                </div>
                <p className="item-desc">
                  Mussels served with pesto cream, marinara, or creamy garlic
                  sauce.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Grilled Salmon</span>
                  <div className="item-line" />
                  <span className="item-price">$28.00</span>
                </div>
                <p className="item-desc">
                  Flaky salmon in a creamy lemon-ginger sauce with rice and
                  seasonal vegetables.
                </p>
              </MenuItem>
            </div>
          </MenuCategory>
        )}

        {/* Pizzas */}
        {activeCategory === "Pizzas" && (
          <MenuCategory>
            <h2>Pizzas</h2>
            <p className="category-note">
              Toppings: small +$1 / large +$2 &nbsp;•&nbsp; Extra Cheese: small
              +$5 / large +$8 &nbsp;•&nbsp; Gluten Free: +$7
            </p>
            <p className="category-note">
              Artichoke, Anchovy, Bacon, Basil, Broccoli, Chicken, Eggplant,
              Diced Tomatoes, Feta, Garlic, Green Peppers, Ham, Jalapeños,
              Linguica, Meatball, Mushrooms, Olives, Onions, Pepperoni, Pesto,
              Pineapple, Ricotta, Salami, Spinach, Sausage, Roasted Red Peppers.
            </p>

            <div className="items">
              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Cheese</span>
                  <div className="item-line" />
                  <span className="item-price">$14 / $21</span>
                </div>
                <p className="item-desc">
                  Laurinos classic pizza sauce, cheddar blend.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Pesto Lovers</span>
                  <div className="item-line" />
                  <span className="item-price">$16 / $28</span>
                </div>
                <p className="item-desc">
                  Fresh basil pesto base with diced tomatoes, onions, crumbled
                  feta &amp; melted cheddar.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Meat Lovers</span>
                  <div className="item-line" />
                  <span className="item-price">$16 / $29</span>
                </div>
                <p className="item-desc">
                  Sausage, pepperoni, bacon, house meatballs, linguica &amp;
                  sliced ham and ground beef.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">The Big Mac</span>
                  <div className="item-line" />
                  <span className="item-price">$17 / $30</span>
                </div>
                <p className="item-desc">
                  Seasoned ground beef, house big mac sauce, shredded lettuce,
                  dill pickles &amp; diced onion on a sesame-seed crust.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">The Greek</span>
                  <div className="item-line" />
                  <span className="item-price">$16 / $29</span>
                </div>
                <p className="item-desc">
                  Garlic layered with baby spinach, roasted red peppers, briny
                  black olives &amp; tangy feta.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Vegetarian</span>
                  <div className="item-line" />
                  <span className="item-price">$16 / $28</span>
                </div>
                <p className="item-desc">
                  A garden medley of our freshest veggies piled high.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Buffalo Chicken</span>
                  <div className="item-line" />
                  <span className="item-price">$17 / $29</span>
                </div>
                <p className="item-desc">
                  Spicy buffalo-tossed chicken with sharp cheddar.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Kitchen Sink</span>
                  <div className="item-line" />
                  <span className="item-price">$17 / $29</span>
                </div>
                <p className="item-desc">
                  An over-the-top mash-up of meats, veggies &amp; cheeses—everything
                  but the kitchen sink.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Tubby’s Pie</span>
                  <div className="item-line" />
                  <span className="item-price">$16 / $29</span>
                </div>
                <p className="item-desc">
                  Tangy ranch base topped with roasted chicken, smoky bacon,
                  melty cheddar &amp; crumbled bleu cheese.
                </p>
              </MenuItem>
            </div>
          </MenuCategory>
        )}

        {/* Sides */}
        {activeCategory === "Sides" && (
          <MenuCategory>
            <h2>Sides</h2>
            <p className="category-note">Add a side to any entrée:</p>
            <div className="items">
              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Side Salad</span>
                  <div className="item-line" />
                  <span className="item-price">$8.00</span>
                </div>
                <p className="item-desc">
                  Mixed greens, tomatoes, cucumbers, shredded carrots and red
                  cabbage.
                </p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Fries</span>
                  <div className="item-line" />
                  <span className="item-price">$6.50 / $8.50</span>
                </div>
                <p className="item-desc">Parmesan truffle option available.</p>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Onion Rings</span>
                  <div className="item-line" />
                  <span className="item-price">$9.00</span>
                </div>
              </MenuItem>

              <MenuItem>
                <div className="item-info">
                  <span className="item-name">Vegetable of the Day</span>
                  <div className="item-line" />
                  <span className="item-price">$7.00</span>
                </div>
              </MenuItem>
            </div>
          </MenuCategory>
        )}
      </MenuContent>

      <MenuFooter>
        <p>Prices subject to change. Please inform your server of any allergies.</p>
        <p>
          Consuming raw or undercooked meats, poultry, seafood, shellfish, or
          eggs may increase your risk of foodborne illness.
        </p>
      </MenuFooter>
    </MenuSection>
  );
}

/* ----------------- Styled Components ----------------- */

const MenuSection = styled.section`
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  min-height: 100vh;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: background-color 0.3s ease, color 0.3s ease;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1rem 0;
  }
`;

const MenuHeader = styled.div`
  margin-bottom: 3rem;
  text-align: center;
  max-width: 700px;
  padding: 0 1.5rem;

  h1 {
    font-family: 'Aloja', serif;
    font-size: 3rem;
    font-weight: 400;
    margin-bottom: 1rem;
    letter-spacing: 0.5px;
    color: ${({ theme }) => theme.colors.text};
    transition: color 0.3s ease;
  }

  h2 {
    font-family: 'Aloja', serif;
    font-size: 1.5rem;
    font-weight: 300;
    margin-bottom: 1rem;
    letter-spacing: 0.5px;
    color: ${({ theme }) => theme.colors.text};
    transition: color 0.3s ease;
  }

  p {
    color: ${({ theme }) => theme.colors.mutedText};
    font-size: 1.1rem;
    line-height: 1.6;
    font-weight: 300;
    transition: color 0.3s ease;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin-bottom: 2rem;
    padding: 0 1rem;
    
    h1 {
      font-size: 2.5rem;
    }
    
    h2 {
      font-size: 1.3rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-bottom: 1.5rem;
    padding: 0 0.5rem;
    
    h1 {
      font-size: 2rem;
    }
    
    h2 {
      font-size: 1.2rem;
    }
    
    p {
      font-size: 0.95rem;
    }
  }
`;

const MenuNav = styled.nav`
  width: 100%;
  background: ${({ theme }) => theme.colors.primaryDark || "#2a2a2a"};
  overflow-x: auto;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const NavInner = styled.div`
  display: flex;
  min-width: min-content;
  max-width: 1200px;
  margin: 0 auto;
`;

const NavItem = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "active",
})`
  background: none;
  border: none;
  padding: 1rem 1.5rem;
  color: ${({ active, theme }) =>
    active ? theme.colors.accent || "#f8f3e9" : theme.colors.light || "#fefefe"};
  font-size: 0.9rem;
  font-weight: ${({ active }) => (active ? 600 : 400)};
  letter-spacing: 0.5px;
  text-transform: uppercase;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: ${({ active }) => (active ? "30%" : "0")};
    height: 2px;
    background-color: ${({ theme }) => theme.colors.accent || "#f8f3e9"};
    transition: width 0.3s ease;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.accent || "#f8f3e9"};
    &:after {
      width: 30%;
    }
  }
`;

const MenuContent = styled.div`
  max-width: 1000px;
  width: 100%;
  padding: 0 1.5rem;
`;

const MenuCategory = styled.div`
  margin-bottom: 3rem;
  animation: fadeIn 0.4s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  h2 {
    font-size: 2rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.tertiaryDark || "#ddd"};
    color: ${({ theme }) => theme.colors.primaryDark || "#2a2a2a"};
  }

  h3 {
    font-size: 1.4rem;
    font-weight: 500;
    margin: 2rem 0 1rem;
    color: ${({ theme }) => theme.colors.primaryDark || "#2a2a2a"};
  }

  .category-note {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.secondaryDark || "#555"};
    font-style: italic;
    margin-bottom: 1.5rem;
  }

  .items {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    .items-grid {
      grid-template-columns: 1fr;
    }
  }
`;

const MenuItem = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
  transition: transform 0.2s ease;
  padding: 0.5rem;
  border-radius: 8px;
  
  &:hover {
    transform: translateY(-2px);
    background: ${({ theme }) => theme.colors.background};
  }

  .item-info {
    display: flex;
    align-items: baseline;
    margin-bottom: 0.5rem;

    .item-name {
      font-weight: 500;
      font-size: 1.1rem;
      color: ${({ theme }) => theme.colors.text};
      flex-shrink: 0;
      transition: color 0.3s ease;
    }

    .item-line {
      flex-grow: 1;
      height: 1px;
      background: ${({ theme }) => theme.colors.border};
      margin: 0 0.5rem;
      position: relative;
      top: -0.3rem;
      transition: background-color 0.3s ease;
    }

    .item-price {
      font-weight: 600;
      color: ${({ theme }) => theme.colors.mutedText};
      flex-shrink: 0;
      transition: color 0.3s ease;
    }
  }

  .item-desc {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.mutedText};
    line-height: 1.4;
    max-width: 90%;
    transition: color 0.3s ease;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-bottom: 1rem;
    padding: 0.3rem;
    
    .item-info {
      flex-wrap: wrap;
      gap: 0.3rem;
    }
    
    .item-name {
      font-size: 1rem;
    }
    
    .item-desc {
      font-size: 0.85rem;
      max-width: 100%;
    }
  }
`;

const MenuFooter = styled.footer`
  margin-top: 2rem;
  padding: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  width: 100%;
  max-width: 1000px;
  text-align: center;
  transition: border-color 0.3s ease;

  p {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.mutedText};
    margin-bottom: 0.5rem;
    font-style: italic;
    transition: color 0.3s ease;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-top: 1rem;
    padding: 1rem;
    
    p {
      font-size: 0.75rem;
    }
  }
`;
