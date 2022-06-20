package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Product.
 */
@Entity
@Table(name = "product")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Product implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "uid_product", nullable = false, unique = true)
    private String uidProduct;

    @NotNull
    @Column(name = "name_product", nullable = false)
    private String nameProduct;

    @OneToMany(mappedBy = "product")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "updates", "product" }, allowSetters = true)
    private Set<VersionApplicable> versionApplicables = new HashSet<>();

    @OneToMany(mappedBy = "product")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "updates", "product" }, allowSetters = true)
    private Set<VersionCible> versionCibles = new HashSet<>();

    @OneToMany(mappedBy = "product")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "versionApplicable", "versionCible", "product" }, allowSetters = true)
    private Set<Update> updates = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Product id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUidProduct() {
        return this.uidProduct;
    }

    public Product uidProduct(String uidProduct) {
        this.setUidProduct(uidProduct);
        return this;
    }

    public void setUidProduct(String uidProduct) {
        this.uidProduct = uidProduct;
    }

    public String getNameProduct() {
        return this.nameProduct;
    }

    public Product nameProduct(String nameProduct) {
        this.setNameProduct(nameProduct);
        return this;
    }

    public void setNameProduct(String nameProduct) {
        this.nameProduct = nameProduct;
    }

    public Set<VersionApplicable> getVersionApplicables() {
        return this.versionApplicables;
    }

    public void setVersionApplicables(Set<VersionApplicable> versionApplicables) {
        if (this.versionApplicables != null) {
            this.versionApplicables.forEach(i -> i.setProduct(null));
        }
        if (versionApplicables != null) {
            versionApplicables.forEach(i -> i.setProduct(this));
        }
        this.versionApplicables = versionApplicables;
    }

    public Product versionApplicables(Set<VersionApplicable> versionApplicables) {
        this.setVersionApplicables(versionApplicables);
        return this;
    }

    public Product addVersionApplicable(VersionApplicable versionApplicable) {
        this.versionApplicables.add(versionApplicable);
        versionApplicable.setProduct(this);
        return this;
    }

    public Product removeVersionApplicable(VersionApplicable versionApplicable) {
        this.versionApplicables.remove(versionApplicable);
        versionApplicable.setProduct(null);
        return this;
    }

    public Set<VersionCible> getVersionCibles() {
        return this.versionCibles;
    }

    public void setVersionCibles(Set<VersionCible> versionCibles) {
        if (this.versionCibles != null) {
            this.versionCibles.forEach(i -> i.setProduct(null));
        }
        if (versionCibles != null) {
            versionCibles.forEach(i -> i.setProduct(this));
        }
        this.versionCibles = versionCibles;
    }

    public Product versionCibles(Set<VersionCible> versionCibles) {
        this.setVersionCibles(versionCibles);
        return this;
    }

    public Product addVersionCible(VersionCible versionCible) {
        this.versionCibles.add(versionCible);
        versionCible.setProduct(this);
        return this;
    }

    public Product removeVersionCible(VersionCible versionCible) {
        this.versionCibles.remove(versionCible);
        versionCible.setProduct(null);
        return this;
    }

    public Set<Update> getUpdates() {
        return this.updates;
    }

    public void setUpdates(Set<Update> updates) {
        if (this.updates != null) {
            this.updates.forEach(i -> i.setProduct(null));
        }
        if (updates != null) {
            updates.forEach(i -> i.setProduct(this));
        }
        this.updates = updates;
    }

    public Product updates(Set<Update> updates) {
        this.setUpdates(updates);
        return this;
    }

    public Product addUpdate(Update update) {
        this.updates.add(update);
        update.setProduct(this);
        return this;
    }

    public Product removeUpdate(Update update) {
        this.updates.remove(update);
        update.setProduct(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Product)) {
            return false;
        }
        return id != null && id.equals(((Product) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Product{" +
            "id=" + getId() +
            ", uidProduct='" + getUidProduct() + "'" +
            ", nameProduct='" + getNameProduct() + "'" +
            "}";
    }
}
